/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/AuthProvider"; // Hook creado en la respuesta anterior
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Image from "next/image";

export default function EventRegistrationPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, loading } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Obtenemos los datos del evento del lado del cliente
  useEffect(() => {
    // Reemplazar con tu llamada a API real
    fetch(`https://tuapi.com/eventos/${params.id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data));
  }, [params.id]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí subes los archivos a S3 si formData contiene archivos
    // Luego envías el JSON final a tu backend
    console.log("Datos a enviar:", formData);
  };

  if (loading || !event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-12 px-4 flex justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-xl border border-zinc-200">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Registro al Evento
        </h1>
        <p className="text-zinc-600 mb-8">
          Estás a un paso de registrarte en:{" "}
          <strong className="text-zinc-900">{event.name}</strong>
        </p>

        {/* Flujo de Autenticación */}
        {!user ? (
          <div className="text-center py-12">
            <p className="mb-6 text-zinc-600">
              Para continuar, necesitas iniciar sesión.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border-2 border-zinc-200 font-bold hover:bg-zinc-50 transition"
            >
              <Image src="/google-icon.svg" alt="Google" className="w-6 h-6" />
              Continuar con Google
            </button>
          </div>
        ) : (
          /* Generador de Formulario Dinámico */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-blue-50 text-[#0000fe] rounded-xl mb-6">
              Autenticado como: <strong>{user.email}</strong>
            </div>

            {event.form_fields.map((field: any) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="font-semibold text-zinc-900">
                  {field.name}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    required={field.required}
                    placeholder={field.placeholder || ""}
                    className="p-3 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#0000fe]"
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                  />
                )}

                {field.type === "file" && (
                  <input
                    type="file"
                    required={field.required}
                    className="p-3 rounded-xl border border-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0000fe] hover:file:bg-blue-100"
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.files?.[0])
                    }
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#0000fe] text-white font-bold hover:bg-[#012f6e] transition-colors mt-8"
            >
              Completar Registro
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

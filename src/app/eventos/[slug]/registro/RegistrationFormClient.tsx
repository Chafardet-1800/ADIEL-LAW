/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/src/lib/firebase/config";
import {
  loginExternalAPI,
  checkRegistrationAPI,
  submitRegistrationAPI,
  LoginResponse,
} from "@/src/services/clientApi";
import Link from "next/link";
import Image from "next/image";
import { setSessionCookie } from "@/src/actions/auth";

export default function RegistrationFormClient({ event }: { event: any }) {
  // Estados de control
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<string>(
    "Verificando sesión...",
  );

  // Estados del formulario
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. EVALUAR SESIÓN AL CARGAR LA VISTA
  useEffect(() => {
    const initCheck = async () => {
      const token = localStorage.getItem("session_token");
      if (token) {
        setSessionToken(token);
        try {
          // Verificar si ya está registrado en este evento
          setLoadingState("Verificando registro previo...");
          const registration = await checkRegistrationAPI(event.id, token);
          if (registration) setIsRegistered(true);
        } catch (error) {
          console.error("Error al verificar registro:", error);
        }
      }
      setLoadingState(""); // Termina la carga inicial
    };
    initCheck();
  }, [event.id]);

  // 2. MANEJAR LOGIN CON GOOGLE
  const handleGoogleLogin = async () => {
    try {
      setLoadingState("Autenticando con Google...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Obtener el ID Token de Firebase
      const idToken = await result.user.getIdToken(true);

      // Enviar al backend para obtener el Token de Sesión
      const backendResponse: LoginResponse = await loginExternalAPI(idToken);
      const newSessionToken: string = backendResponse.access_token; // Asegúrate de que coincida con tu API

      // Guardamos en la Cookie mediante la Server Action
      await setSessionCookie(newSessionToken);
      setSessionToken(newSessionToken);

      // Verificar si ya estaba registrado
      setLoadingState("Validando estado del evento...");
      const registration = await checkRegistrationAPI(
        event.id,
        newSessionToken,
      );
      if (registration) setIsRegistered(true);
    } catch (error) {
      console.error("Error en login:", error);
      alert("Hubo un error al iniciar sesión.");
    } finally {
      setLoadingState("");
    }
  };

  // 3. MANEJO DEL FORMULARIO
  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken) return;

    setIsSubmitting(true);
    try {
      // NOTA TECH LEAD: Aquí iría la lógica para subir archivos a S3 si `formData` tiene un File.
      // Reemplazaríamos el File por la URL de S3 antes de enviarlo.

      await submitRegistrationAPI(event.id, formData, sessionToken);
      setIsRegistered(true); // Éxito
    } catch (error) {
      console.error("Error enviando formulario:", error);
      alert("Hubo un error al completar tu registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDERIZADO VISUAL PREMIUM ---

  if (loadingState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50/50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mb-4" />
        <p className="text-blue-950 font-bold">{loadingState}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50/50 via-white to-blue-50 pt-32 pb-20 px-4 relative overflow-hidden flex justify-center items-start">
      {/* Elementos Decorativos Glassmorphism */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Contenedor Principal de la Tarjeta */}
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white relative z-10 animate-fade-in-up">
        {/* Cabecera de la Tarjeta */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-4">
            Proceso de Inscripción
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-3 tracking-tight">
            Registro al Evento
          </h1>
          <p className="text-zinc-600 font-medium">
            Estás a un paso de confirmar tu asistencia a: <br />
            <strong className="text-blue-700 text-lg block mt-1">
              {event.name}
            </strong>
          </p>
        </div>

        {/* ESCENARIO 1: Ya está registrado */}
        {isRegistered ? (
          <div className="text-center py-10 bg-green-50/50 rounded-[2rem] border border-green-100">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <span className="text-white text-4xl">✓</span>
            </div>
            <h2 className="text-2xl font-extrabold text-green-950 mb-2">
              ¡Ya estás registrado!
            </h2>
            <p className="text-green-800 font-medium mb-8">
              Tu registro para este evento ha sido confirmado.
            </p>
            <Link
              href={`/eventos`}
              className="px-8 py-3.5 rounded-full bg-white text-green-700 font-bold border border-green-200 hover:bg-green-50 transition-colors"
            >
              Volver a Eventos
            </Link>
          </div>
        ) : /* ESCENARIO 2: Necesita Iniciar Sesión */
        !sessionToken ? (
          <div className="text-center py-8">
            <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 mb-8">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                Autenticación Requerida
              </h3>
              <p className="text-zinc-600 font-medium text-sm">
                Para garantizar la seguridad de tu registro y tus certificados,
                necesitamos que inicies sesión.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-4 w-full py-4 rounded-2xl bg-white border-2 border-zinc-200 font-bold text-zinc-700 hover:bg-zinc-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow-md group"
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                className="w-6 h-6 group-hover:scale-110 transition-transform"
                width={24}
                height={24}
              />
              Continuar con Google
            </button>
          </div>
        ) : (
          /* ESCENARIO 3: Formulario de Registro Activo */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-5 bg-blue-950 text-white rounded-[2rem] shadow-lg flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
                👤
              </div>
              <div>
                <p className="text-xs text-blue-300 uppercase tracking-wider font-bold">
                  Sesión Activa
                </p>
                <p className="font-medium text-sm">Validado correctamente</p>
              </div>
            </div>

            <div className="space-y-5">
              {event.form_fields?.map((field: any) => (
                <div key={field.key} className="flex flex-col gap-2">
                  <label className="font-bold text-blue-950 ml-1">
                    {field.name}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      required={field.required}
                      placeholder={
                        field.placeholder || "Ingresa tu respuesta..."
                      }
                      className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-all text-zinc-800 placeholder:text-zinc-400 font-medium"
                      onChange={(e) =>
                        handleInputChange(field.key, e.target.value)
                      }
                    />
                  )}

                  {field.type === "file" && (
                    <div className="relative">
                      <input
                        type="file"
                        required={field.required}
                        className="w-full p-3 rounded-2xl bg-blue-50/50 border border-blue-100 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-700 file:text-white hover:file:bg-blue-800 focus:outline-none transition-all text-zinc-600 cursor-pointer"
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.files?.[0])
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4.5 rounded-2xl bg-blue-700 text-white font-extrabold text-lg hover:bg-blue-800 hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-700/30 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex justify-center items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Registro"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

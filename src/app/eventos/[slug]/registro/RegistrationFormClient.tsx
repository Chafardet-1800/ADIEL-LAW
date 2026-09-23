/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 👈 Importamos el router de Next.js
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/src/lib/firebase/config";
import {
  loginExternalAPI,
  checkRegistrationAPI,
  submitRegistrationAPI,
  LoginResponse,
} from "@/src/services/clientApi";
import Image from "next/image";
import { getSessionCookie, setSessionCookie } from "@/src/actions/auth";

// Función utilitaria para reconstruir la URL base del evento
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function RegistrationFormClient({ event }: { event: any }) {
  const router = useRouter(); // 👈 Inicializamos el router

  // Estados de control
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<string>(
    "Verificando sesión...",
  );

  // Estados del formulario
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reconstruimos la URL del evento para la redirección
  const eventUrl = `/eventos/${slugify(event.name)}-${event.id}`;

  // FUNCIÓN CENTRALIZADA DE REDIRECCIÓN (UX)
  const handleSuccessRedirect = () => {
    setIsRegistered(true);
    setLoadingState("");

    // 1. Forzamos a Next.js a destruir la caché cliente y limpiar la memoria
    router.refresh();

    // Mostramos el mensaje de éxito y luego redirigimos automáticamente a los 2.5 segundos
    setTimeout(() => {
      router.push(eventUrl);
    }, 2500);
  };

  // 1. EVALUAR SESIÓN AL CARGAR LA VISTA
  useEffect(() => {
    const initCheck = async () => {
      const token = (await getSessionCookie()) || "";

      if (token) {
        setSessionToken(token);
        try {
          setLoadingState("Verificando registro previo...");
          const registration = await checkRegistrationAPI(event.id, token);
          if (registration) {
            handleSuccessRedirect(); // Si ya está registrado, disparamos el flujo de éxito
            return; // Salimos temprano para no quitar el loadingState aún
          }
        } catch (error) {
          console.error("Error al verificar registro:", error);
        }
      }
      setLoadingState("");
    };
    initCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  // 2. MANEJAR LOGIN CON GOOGLE
  const handleGoogleLogin = async () => {
    try {
      setLoadingState("Autenticando con Google...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken(true);
      const backendResponse: LoginResponse = await loginExternalAPI(idToken);
      const newSessionToken: string = backendResponse.access_token;

      await setSessionCookie(newSessionToken);
      setSessionToken(newSessionToken);

      setLoadingState("Validando estado del evento...");
      const registration = await checkRegistrationAPI(
        event.id,
        newSessionToken,
      );

      if (registration) {
        handleSuccessRedirect(); // 👈 Redirección automática tras login si ya estaba registrado
      } else {
        setLoadingState("");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Hubo un error al iniciar sesión.");
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
      await submitRegistrationAPI(event.id, formData, sessionToken);
      handleSuccessRedirect(); // 👈 Redirección automática tras completar el formulario
    } catch (error) {
      console.error("Error enviando formulario:", error);
      alert("Hubo un error al completar tu registro.");
      setIsSubmitting(false);
    }
  };

  // --- RENDERIZADO VISUAL PREMIUM (Compacto) ---

  if (loadingState) {
    return (
      // Redujimos de min-h-screen a min-h-[80vh] para evitar scrolls enormes
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-blue-50/50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mb-4" />
        <p className="text-blue-950 font-bold animate-pulse">{loadingState}</p>
      </div>
    );
  }

  return (
    // Contenedor centrado y más compacto
    <div className="min-h-[80vh] bg-linear-to-br from-blue-50/50 via-white to-blue-50 py-20 px-4 relative overflow-hidden flex justify-center items-center">
      {/* Elementos Decorativos */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Contenedor Principal (Modal Style) */}
      <div className="max-w-xl w-full bg-white/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-white relative z-10 animate-fade-in-up">
        {/* ESCENARIO 1: Ya está registrado (Flujo de salida) */}
        {isRegistered ? (
          <div className="text-center py-6">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30 animate-bounce">
              <span className="text-white text-5xl">✓</span>
            </div>
            <h2 className="text-3xl font-extrabold text-green-950 mb-3">
              ¡Registro Exitoso!
            </h2>
            <p className="text-green-800 font-medium mb-8">
              Tu participación en{" "}
              <strong className="text-green-950">{event.name}</strong> ha sido
              confirmada.
            </p>
            <div className="flex items-center justify-center gap-3 text-sm text-green-700 font-bold animate-pulse">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              Redirigiendo al evento...
            </div>
          </div>
        ) : (
          // ESCENARIOS DE INGRESO (Login o Formulario)
          <>
            {/* Cabecera compacta */}
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-3">
                Inscripción
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-2 tracking-tight">
                {event.name}
              </h1>
            </div>

            {/* ESCENARIO 2: Necesita Iniciar Sesión */}
            {!sessionToken ? (
              <div className="text-center">
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-6">
                  <span className="text-4xl mb-3 block">🔒</span>
                  <h3 className="text-lg font-bold text-blue-950 mb-1">
                    Verifica tu identidad
                  </h3>
                  <p className="text-zinc-600 font-medium text-sm">
                    Inicia sesión para proteger tu registro y certificados.
                  </p>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white border-2 border-zinc-200 font-bold text-zinc-700 hover:bg-zinc-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm hover:shadow-md group"
                >
                  <Image
                    src="/google-icon.svg"
                    alt="Google"
                    className="group-hover:scale-110 transition-transform"
                    width={20}
                    height={20}
                  />
                  Continuar con Google
                </button>
              </div>
            ) : (
              /* ESCENARIO 3: Formulario Activo */
              <form onSubmit={handleSubmit} className="space-y-5">
                {event.form_fields?.map((field: any) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="font-bold text-sm text-blue-950 ml-1">
                      {field.name}{" "}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    {field.type === "text" && (
                      <input
                        type="text"
                        required={field.required}
                        placeholder={
                          field.placeholder || "Ingresa tu respuesta..."
                        }
                        className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition-all text-blue-950 placeholder:text-zinc-400 font-medium"
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                      />
                    )}

                    {field.type === "file" && (
                      <input
                        type="file"
                        required={field.required}
                        className="w-full p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-700 file:text-white hover:file:bg-blue-800 focus:outline-none transition-all text-zinc-600 cursor-pointer"
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.files?.[0])
                        }
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-blue-700 text-white font-extrabold hover:bg-blue-800 hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-700/30 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
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
          </>
        )}
      </div>
    </div>
  );
}

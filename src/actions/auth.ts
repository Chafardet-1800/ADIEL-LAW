// src/actions/auth.ts
"use server";

import { cookies } from "next/headers";

// Guardar el token en una cookie HTTP (Más seguro que LocalStorage)
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: false, // Permitimos que el cliente lo lea si es necesario, o true si es estricto
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  });
}

// Leer el token desde el cliente o servidor
export async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value || null;
}

// src/services/api.ts
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // 1. Obtenemos las cookies en el servidor de forma asíncrona
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  // 2. Configuramos los headers por defecto y agregamos el token si existe
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 3. Ejecutamos el fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Aquí podrías manejar errores de autenticación (ej: 401 para desloguear)
    throw new Error(
      `Error en la API: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

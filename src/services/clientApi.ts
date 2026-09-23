/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/clientApi.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tuapi.com/api";

export interface LoginResponse {
  message: string;
  access_token: string;
  user: User;
}
export interface User {
  email: string;
  name: string;
  picture: string;
}

// 1. Iniciar sesión con el token de Google
export async function loginExternalAPI(idToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login/external`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Error en autenticación externa");
  return res.json();
}

// 2. Verificar si ya está registrado
export async function checkRegistrationAPI(eventId: string, token: string) {
  console.log(token);

  const res = await fetch(
    `${API_BASE_URL}/event-responses/external/${eventId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  // Si devuelve 404, asumimos que no está registrado. Si es 200, ya lo está.
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error verificando registro");
  return res.json();
}

// 3. Enviar el registro del formulario
export async function submitRegistrationAPI(
  eventId: string,
  formData: any,
  token: string,
) {
  const payload = {
    event_id: eventId,
    status: "EN_PROCESO",
    form_data: formData,
  };

  const res = await fetch(`${API_BASE_URL}/event-responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al enviar el registro");
  return res.json();
}

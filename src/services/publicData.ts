// src/services/publicData.ts
import { fetchApi } from "./api";
import { cache } from "react";

// Interfaces básicas para tipar nuestros retornos
export interface Institution {
  location?: Location;
  metadata: Metadata;
  social_links: Sociallinks;
  id: string;
  name: string;
  address?: string;
  building_images: string[];
  entity_type: string;
  history: string;
  logo_url: string;
  members_images: string[];
  mission: string;
  slogan: string;
  url_maps?: string;
  vision: string;
  event_ids: string[];
}
interface Sociallinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
}

interface Location {
  coordinates: number[];
  type: string;
}

export interface Post {
  metadata: Metadata;
  id: string;
  content: string;
  images: string[];
  meta_description: string;
  slug: string;
  tags: string[];
  title: string;
  author_id: string;
  institution_id: string;
  author: Author;
  institution: Institutioninfo;
}
interface Institutioninfo {
  name: string;
  entity_type: string;
}
interface Author {
  name: string;
  lastname: string;
}
interface Metadata {
  created_date: string;
  is_deleted: boolean;
  is_published: boolean;
  published_at: string;
  update_date: string;
}

// Interfaz adaptada a tu JSON de Events
export interface Event {
  metadata: Metadata;
  active_schedule: Activeschedule[];
  form_fields: Formfield[];
  deliverables: Deliverable[];
  id: string;
  name: string;
  description: string;
  event_type: string;
  init_date: string;
  end_date: string;
  images: string[];
  documents: string[];
  created_by: string;
  event_lead: string;
  requires_registration: boolean;
  institution_ids: string[];
  participant_ids: string[];
  creator: Creator;
  lead: Lead;
  institutions: Creator[];
}
interface Lead {
  name: string;
  lastname: string;
  phone_number: string;
}
interface Creator {
  name: string;
}
export interface Deliverable {
  id: string;
  name: string;
  total_quota: number;
}
interface Formfield {
  name: string;
  key: string;
  pattern?: string;
  placeholder?: string;
  required: boolean;
  type: string;
  list_value: string[];
}
interface Activeschedule {
  active_name: string;
  start_time: string;
  end_time: string;
}

export interface EventRegister {
  metadata: Metadata;
  deliverables_received: string[];
  id: string;
  status: string;
  email: string;
  reason_for_rejection?: string;
  form_data: Map<string, string>;
  register_data: Map<string, string>;
  show_register_data: boolean;
  event_id: string;
  event: EventInfo;
}
interface EventInfo {
  name: string;
  init_date: string;
}

/**
 * ==========================================
 * 1. PETICIONES MAESTRAS AL BACKEND (HTTP)
 * ==========================================
 * Estas funciones sí van al backend, pero gracias a `cache()`,
 * solo se ejecutan una vez por renderizado.
 */

// Trae ABSOLUTAMENTE TODAS las instituciones
export const getAllInstitutions = cache(async (): Promise<Institution[]> => {
  return fetchApi<Institution[]>("/institutions", {
    next: { revalidate: 3600, tags: ["institutions"] },
  });
});

// Trae ABSOLUTAMENTE TODOS los posts
export const getPosts = cache(async (id?: string): Promise<Post[]> => {
  return fetchApi<Post[]>(id ? `/posts/?institutionId=${id}` : "/posts", {
    next: { revalidate: 3600, tags: ["posts"] },
  });
});

// Trae ABSOLUTAMENTE TODOS los eventos
export const getEvents = cache(async (): Promise<Event[]> => {
  return fetchApi<Event[]>("/events", {
    next: { revalidate: 3600, tags: ["events"] },
  });
});

// Trae ABSOLUTAMENTE TODOS los eventos
export const getEventRegisters = cache(
  async (id?: string): Promise<EventRegister> => {
    return fetchApi<EventRegister>(`/event-responses/external/${id}`, {
      next: { revalidate: 3600, tags: ["events"] },
    });
  },
);

/**
 * ==========================================
 * 2. FUNCIONES DERIVADAS (FILTROS EN MEMORIA)
 * ==========================================
 * Estas funciones NO hacen peticiones al backend.
 * Reutilizan la caché de la petición maestra y filtran rapidísimo en RAM.
 */

// Filtrar solo las Iglesias
export const getChurches = async (): Promise<Institution[]> => {
  const allInstitutions = await getAllInstitutions();
  return allInstitutions.filter((inst) => inst.entity_type === "CHURCH");
};

// Filtrar solo las Unidades de Servicio
export const getServiceUnits = async (): Promise<Institution[]> => {
  const allInstitutions = await getAllInstitutions();
  return allInstitutions.filter((inst) => inst.entity_type === "SERVICE_UNIT");
};

/**
 * ==========================================
 * 3. BUSCADORES POR ID (RUTAS DINÁMICAS)
 * ==========================================
 */

// Como iglesias y unidades son lo mismo, podemos usar una sola función unificada para buscar por ID
export const getInstitutionById = async (
  id: string,
): Promise<Institution | undefined> => {
  const allInstitutions = await getAllInstitutions();

  return allInstitutions.find((inst) => inst.id === id);
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  const posts = await getPosts();
  return posts.find((post) => post.id === id);
};

export const getEventoById = async (id: string): Promise<Event | undefined> => {
  const events = await getEvents();
  return events.find((evento) => evento.id === id);
};

export const getEventsByInstitutionId = async (
  institutionId: string,
): Promise<Event[]> => {
  const events = await getEvents();
  return events.filter(
    (evento) =>
      evento.institution_ids && evento.institution_ids.includes(institutionId),
  );
};

/**
 * ==========================================
 * 4. UTILIDADES GLOBALES
 * ==========================================
 */

// Extraer el ID de la URL híbrida (ej: mi-iglesia-6a285322...)
export function getIdFromSlug(slug: string) {
  if (!slug) return "";
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

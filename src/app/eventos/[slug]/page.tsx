/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import Link from "next/link";
import {
  Creator,
  Deliverable,
  Event,
  EventRegister,
  getEventoById,
  getIdFromSlug,
} from "@/src/services/publicData";
import { getSessionCookie } from "@/src/actions/auth";
import RefreshTicketButton from "@/src/components/RefreshTicketButton";
import EventSchedule from "@/src/components/EventSchedule";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. GENERACIÓN DE METADATA
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const event = await getEventoById(id);

  if (!event) return { title: "Evento no encontrado | Red ADIEL" };

  return {
    title: `${event.name} | Red ADIEL`,
    description: event.description.substring(0, 160),
    openGraph: {
      images: event.images && event.images.length > 0 ? [event.images[0]] : [],
    },
  };
}

// 2. COMPONENTE PRINCIPAL
export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const event: Event | undefined = await getEventoById(id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50/50">
        <h1 className="text-2xl font-bold text-blue-950">
          Evento no encontrado
        </h1>
      </div>
    );
  }

  // --- OBTENER MÚLTIPLES REGISTROS (Array) ---
  const token = await getSessionCookie();
  let userRegistrations: EventRegister[] = [];

  if (token) {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/event-responses/my-tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          userRegistrations = data;
        }
      }
    } catch (error) {
      console.error("Error obteniendo los registros:", error);
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    startDate: event.init_date,
    endDate: event.end_date,
    image: event.images,
    description: event.description,
  };

  const heroImage = event.images?.[0];
  const hasRegistrations = userRegistrations.length > 0;

  return (
    <article className="min-h-screen bg-linear-to-b from-blue-50/50 via-white to-blue-50 pb-32 relative">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* --- HERO SECTION TIPO BANNER --- */}
      <header className="relative w-full h-80 md:h-112.5 bg-blue-950 overflow-hidden flex items-end justify-center rounded-b-[3rem] shadow-2xl shadow-blue-900/10 mb-20 z-10">
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt={event.name}
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-linear-to-t from-blue-950 via-blue-900/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-tr from-blue-950 via-blue-900 to-blue-800 opacity-90" />
        )}
      </header>

      {/* --- CONTENEDOR PRINCIPAL ELEVADO --- */}
      <div className="max-w-6xl mx-auto px-4 -mt-44 relative z-20">
        <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 mb-12 text-center md:text-left">
          <span className="inline-block px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-blue-200/50">
            {event.event_type}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-950 tracking-tight leading-tight">
            {event.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA (Info Básica y Cronograma) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-blue-50">
              <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 text-xl">
                  ℹ️
                </span>
                Sobre el evento
              </h2>
              <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed font-medium">
                {event.description}
              </p>
            </section>

            <EventSchedule schedule={event.active_schedule} />
          </div>

          {/* COLUMNA DERECHA (Sidebar de Tickets y Detalles Equilibrados) */}
          <div className="space-y-6">
            {/* ESCENARIO A: TICKETS MÚLTIPLES (Si el usuario está registrado) */}
            {hasRegistrations && (
              <div className="bg-linear-to-br from-blue-950 to-blue-900 p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/20 border border-blue-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6 border-b border-blue-800/50 pb-4">
                    <h3 className="text-2xl font-extrabold flex items-center gap-2">
                      <span>🎟️</span> Mis Tickets
                    </h3>
                    <RefreshTicketButton />
                  </div>

                  <div className="space-y-6">
                    {userRegistrations.map((reg, index) => {
                      // Diferenciamos los tickets buscando un nombre en el form_data
                      const formEntries = reg.form_data
                        ? Object.entries(reg.form_data)
                        : [];
                      const nameEntry = formEntries.find(([key]) =>
                        key.toLowerCase().includes("nombre"),
                      );
                      const ticketHolderName = nameEntry
                        ? nameEntry[1]
                        : `Inscripción #${index + 1}`;

                      return (
                        <div
                          key={reg.id}
                          className="bg-white/5 border border-white/10 rounded-2xl p-5 relative"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-blue-100">
                              {String(ticketHolderName)}
                            </h4>
                            <span
                              className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                reg.status === "APPROVED"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : reg.status === "REJECTED"
                                    ? "bg-red-500/20 text-red-300 border-red-500/30"
                                    : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              }`}
                            >
                              {reg.status === "PENDING"
                                ? "En Proceso"
                                : reg.status}
                            </span>
                          </div>

                          {/* Motivo de rechazo */}
                          {reg.status === "REJECTED" &&
                            reg.reason_for_rejection && (
                              <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-xl">
                                <p className="text-[10px] text-red-300 font-bold uppercase mb-1">
                                  Motivo:
                                </p>
                                <p className="text-xs text-red-100">
                                  {reg.reason_for_rejection}
                                </p>
                              </div>
                            )}

                          {/* Datos de Asignación Administrativa */}
                          {reg.show_register_data &&
                            reg.register_data &&
                            Object.keys(reg.register_data).length > 0 && (
                              <div className="grid grid-cols-2 gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl">
                                {Object.entries(reg.register_data).map(
                                  ([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                      <span className="text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                                        {key}
                                      </span>
                                      <span
                                        className="text-white font-bold text-sm truncate"
                                        title={String(value)}
                                      >
                                        {String(value)}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TARJETA DE DETALLES, DOCUMENTOS Y ENTREGABLES */}
            {/* Esta tarjeta siempre se muestra, dándole equilibrio a la vista (Escenario A y B) */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/10 border border-white sticky top-24">
              <h3 className="text-2xl font-extrabold text-blue-950 mb-6">
                Detalles
              </h3>

              {event.lead && (
                <div className="mb-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg shrink-0">
                    {event.lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mb-0.5">
                      Líder a cargo
                    </p>
                    <p className="text-sm font-extrabold text-blue-950">
                      {event.lead.name} {event.lead.lastname}
                    </p>
                  </div>
                </div>
              )}

              {event.institutions && event.institutions.length > 0 && (
                <div className="mb-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col gap-3">
                  <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                    Organizado por
                  </p>
                  <div className="flex flex-col gap-2">
                    {event.institutions.map((inst: Creator, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-xs font-bold shrink-0">
                          {inst.name.charAt(0)}
                        </span>
                        <span className="text-sm font-extrabold text-blue-950">
                          {inst.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- DOCUMENTOS ADJUNTOS --- */}
              {event.documents && event.documents.length > 0 && (
                <div className="mt-8 pt-6 border-t border-blue-50">
                  <h3 className="text-lg font-extrabold text-blue-950 mb-4 flex items-center gap-2">
                    <span className="text-blue-700">📄</span> Documentos
                    adjuntos
                  </h3>
                  <div className="flex flex-col gap-3">
                    {event.documents.map((docUrl: string, idx: number) => {
                      const fileName =
                        docUrl.split("/").pop() || `Documento ${idx + 1}`;
                      return (
                        <a
                          key={idx}
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100 hover:border-blue-300 hover:bg-white transition-all group shadow-sm"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                            ⬇️
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-sm text-blue-950 truncate">
                              {fileName}
                            </p>
                            <p className="text-[10px] uppercase font-bold text-blue-500">
                              Descargar
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- ENTREGABLES (INCLUYE) --- */}
              {event.deliverables && event.deliverables.length > 0 && (
                <div className="mt-8 pt-6 border-t border-blue-50">
                  <h3 className="text-lg font-extrabold text-blue-950 mb-4 flex items-center gap-2">
                    <span className="text-blue-700">🎁</span> Incluye
                  </h3>
                  <ul className="space-y-3">
                    {event.deliverables.map(
                      (item: Deliverable, idx: number) => (
                        <li
                          key={item.id || idx}
                          className="flex items-start gap-3 text-zinc-700 font-medium p-3 rounded-xl bg-blue-50/30 border border-blue-50 shadow-sm"
                        >
                          <span className="text-blue-700 bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                            ✓
                          </span>
                          <span>
                            <span className="font-bold text-sm text-blue-950">
                              {item.name}
                            </span>
                            {item.total_quota > 1 && (
                              <span className="ml-2 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                x{item.total_quota}
                              </span>
                            )}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTÓN FLOTANTE SIEMPRE VISIBLE --- */}
      {event.requires_registration && (
        <div className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md animate-fade-in-up">
          <Link
            href={`/eventos/${resolvedParams.slug}/registro`}
            className={`flex items-center justify-center gap-3 w-full py-4 md:py-5 px-8 rounded-full backdrop-blur-lg text-white font-extrabold text-lg transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(29,78,216,0.6)] border hover:scale-105 ${
              hasRegistrations
                ? "bg-blue-900/95 border-blue-700 hover:bg-blue-950"
                : "bg-blue-700/95 border-blue-400/30 hover:bg-blue-800"
            }`}
          >
            <span>
              {hasRegistrations
                ? "Añadir otra inscripción"
                : "Registrarme al Evento"}
            </span>
            <span className="bg-white text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
              +
            </span>
          </Link>
        </div>
      )}
    </article>
  );
}

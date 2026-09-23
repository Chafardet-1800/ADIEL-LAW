import { Metadata } from "next";
import Link from "next/link";
import {
  Deliverable,
  Event,
  EventRegister,
  getEventoById,
  getEventRegisters,
  getIdFromSlug,
} from "@/src/services/publicData";
import { getSessionCookie } from "@/src/actions/auth"; // 👈 Importamos nuestra Server Action
import Image from "next/image";
import EventSchedule from "@/src/components/EventSchedule";
import RefreshTicketButton from "@/src/components/RefreshTicketButton";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. GENERACIÓN DE METADATA (Se mantiene igual)
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

  // --- LÓGICA DE VERIFICACIÓN DE REGISTRO EN EL SERVIDOR ---
  const token = await getSessionCookie();
  let userRegistration: EventRegister | null = null;

  if (token) {
    try {
      userRegistration = await getEventRegisters(id);
      console.log(userRegistration);
    } catch (error) {
      console.error("Error obteniendo el registro del usuario:", error);
    }
  }

  // SEO: Datos estructurados específicos para Eventos
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

  return (
    <article className="min-h-screen bg-linear-to-b from-blue-50/50 via-white to-blue-50 pb-32 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- HERO SECTION TIPO BANNER --- */}
      <header className="relative w-full h-80 md:h-112.5 bg-blue-950 overflow-hidden flex items-end justify-center rounded-b-[3rem] shadow-2xl shadow-blue-900/10 mb-20 z-10">
        {heroImage ? (
          <>
            <Image
              src={heroImage}
              alt={event.name}
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-linear-to-t from-blue-950 via-blue-900/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-tr from-blue-950 via-blue-900 to-blue-800 opacity-90" />
        )}
      </header>

      {/* --- CONTENEDOR PRINCIPAL ELEVADO --- */}
      <div className="max-w-6xl mx-auto px-4 -mt-44 relative z-20">
        {/* Cabecera / Tarjeta de Título Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 mb-12 text-center md:text-left">
          <span className="inline-block px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm border border-blue-200/50">
            {event.event_type}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-950 tracking-tight leading-tight">
            {event.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA (Contenido Principal) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-blue-50 hover:shadow-lg hover:shadow-blue-900/5 transition-shadow duration-300">
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

            {/* --- SECCIÓN DE DOCUMENTOS --- */}
            {event.documents && event.documents.length > 0 && (
              <section className="bg-blue-50/50 p-8 md:p-12 rounded-[2.5rem] border border-blue-100 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-700 text-xl shadow-sm">
                    📄
                  </span>
                  Documentos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.documents.map((docUrl: string, idx: number) => {
                    const fileName =
                      docUrl.split("/").pop() || `Documento adjunto ${idx + 1}`;
                    return (
                      <a
                        key={idx}
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                          ⬇️
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-blue-950 truncate">
                            {fileName}
                          </p>
                          <p className="text-xs text-zinc-500 font-medium">
                            Ver / descargar
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Cronograma Interactivo */}
            <EventSchedule schedule={event.active_schedule} />
          </div>

          {/* COLUMNA DERECHA (Sidebar flotante) */}
          <div className="space-y-6">
            <div className="bg-linear-to-br from-blue-950 to-blue-900 flex flex-col gap-4 p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/20 border border-blue-800 text-white relative overflow-hidden">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-extrabold text-white mb-6">
                  Detalles
                </h3>

                {/* BOTÓN DE REFRESCO */}
                <RefreshTicketButton />
              </div>

              {/* Elemento de cristal decorativo */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

              {/* Información del registro */}
              {userRegistration && (
                <div className="flex flex-col gap-4">
                  {/* Encabezado y estado */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-extrabold flex items-center gap-2">
                      <span>🎟️</span> Mi Ticket
                    </h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                      {userRegistration.status === "PENDING"
                        ? "Pendiente"
                        : userRegistration.status === "CONFIRMED"
                          ? "Confirmado"
                          : userRegistration.status === "CANCELLED"
                            ? "Cancelado por Usuario"
                            : userRegistration.status === "ACTIVE"
                              ? "Activo"
                              : userRegistration.status === "REJECTED"
                                ? "Rechazado"
                                : userRegistration.status === "COMPLETED"
                                  ? "Completado"
                                  : "Pendiente"}
                    </span>
                  </div>

                  {/* Datos del Registro formulario */}
                  {userRegistration.form_data &&
                    userRegistration.form_data !== null && (
                      <div className="space-y-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        {Object.entries(userRegistration.form_data).map(
                          ([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                                {key}
                              </span>
                              <span className="text-white font-extrabold text-lg">
                                {String(value)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                  {/* Motivo de rechazo (Si aplica) */}
                  {userRegistration.status === "REJECTED" &&
                    userRegistration.reason_for_rejection && (
                      <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-2xl">
                        <p className="text-xs text-red-300 font-bold uppercase tracking-wider mb-1">
                          Motivo de rechazo:
                        </p>
                        <p className="text-sm text-red-100">
                          {userRegistration.reason_for_rejection}
                        </p>
                      </div>
                    )}

                  {/* RESPUESTAS DEL FORMULARIO (Recuperado) */}
                  {userRegistration.form_data &&
                    userRegistration.form_data.size > 0 && (
                      <div className="mb-6 p-5 bg-blue-900/50 rounded-2xl border border-blue-800">
                        <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-4">
                          Información enviada:
                        </p>
                        <div className="space-y-4">
                          {event.form_fields?.map((field) => {
                            const answer =
                              userRegistration.form_data.get(field.key) ?? "";
                            if (!answer) return null;
                            const isFile =
                              field.type === "file" ||
                              answer.toString().startsWith("http");

                            return (
                              <div
                                key={field.key}
                                className="border-l-2 border-blue-500 pl-3"
                              >
                                <p className="text-xs text-blue-300 font-medium mb-0.5">
                                  {field.name}
                                </p>
                                {isFile ? (
                                  <a
                                    href={answer}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-white underline hover:text-blue-200"
                                  >
                                    Ver documento adjunto
                                  </a>
                                ) : (
                                  <p className="text-sm font-bold text-white">
                                    {String(answer)}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Datos del Registro (Cabaña, Coordinador, etc) */}
                  {userRegistration.register_data &&
                  Object.keys(userRegistration.register_data).length > 0 ? (
                    <div className="space-y-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                      {Object.entries(userRegistration.register_data).map(
                        ([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-0.5">
                              {key}
                            </span>
                            <span className="text-white font-extrabold text-lg">
                              {String(value)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                      <p className="text-blue-200 text-sm font-medium">
                        Tus datos de asignación estarán disponibles pronto.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* LIDER A CARGO */}
              {event.lead && (
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
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

              {/* INSTITUCIONES ORGANIZADORAS */}
              {event.institutions && event.institutions.length > 0 && (
                <div className="mb-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col gap-3">
                  <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                    Organizado por
                  </p>
                  <div className="flex flex-col gap-2">
                    {event.institutions.map(
                      (inst: { name: string }, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-xs font-bold shrink-0">
                            {inst.name.charAt(0)}
                          </span>
                          <span className="text-sm font-extrabold text-blue-950">
                            {inst.name}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ENTREGABLES */}
            {event.deliverables && event.deliverables.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-blue-50">
                <h3 className="text-xl font-extrabold text-blue-950 mb-5 flex items-center gap-2">
                  <span className="text-blue-700">🎁</span> Incluye:
                </h3>
                <ul className="space-y-4">
                  {event.deliverables.map((item: Deliverable, idx: number) => (
                    <li
                      key={item.id || idx}
                      className="flex items-start gap-3 text-zinc-700 font-medium p-3 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      <span className="text-blue-700 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-sm">
                        ✓
                      </span>
                      <span>
                        <span className="font-bold text-blue-950">
                          {item.name}
                        </span>
                        {item.total_quota > 1 && (
                          <span className="ml-2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                            x{item.total_quota}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BOTÓN FLOTANTE (FAB) SÓLO SI NO ESTÁ REGISTRADO --- */}
      {event.requires_registration && !userRegistration && (
        <div className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md animate-fade-in-up">
          <Link
            href={`/eventos/${resolvedParams.slug}/registro`}
            className="flex items-center justify-center gap-3 w-full py-4 md:py-5 px-8 rounded-full bg-blue-700/95 backdrop-blur-lg text-white font-extrabold text-lg shadow-[0_10px_40px_-10px_rgba(29,78,216,0.6)] border border-blue-400/30 hover:bg-blue-800 hover:scale-105 transition-all duration-300"
          >
            <span>Registrarme al Evento</span>
            <span className="bg-white text-blue-700 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
              →
            </span>
          </Link>
        </div>
      )}
    </article>
  );
}

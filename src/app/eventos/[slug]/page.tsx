import { Metadata } from "next";
import Link from "next/link";
import {
  Deliverable,
  Event,
  getEventoById,
  getIdFromSlug,
} from "@/src/services/publicData";
import Image from "next/image";
import EventSchedule from "@/src/components/EventSchedule";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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

export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const event: Event | undefined = await getEventoById(id); // Cast a any temporal por los nuevos campos del JSON

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50/50">
        <h1 className="text-2xl font-bold text-blue-950">
          Evento no encontrado
        </h1>
      </div>
    );
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

  return (
    <article className="min-h-screen bg-linear-to-b from-blue-200 via-white to-blue-50 pb-20">
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
          <span className="inline-block px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-4">
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

            {/* Cronograma Interactivo (Client Component) */}
            <EventSchedule schedule={event.active_schedule} />
          </div>

          {/* COLUMNA DERECHA (Sidebar flotante) */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/10 border border-white top-24">
              <h3 className="text-2xl font-extrabold text-blue-950 mb-6">
                Detalles
              </h3>

              {/* LIDER A CARGO */}
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

              {/* INSTITUCIONES ORGANIZADORAS (Movidas a la misma altura que el líder) */}
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

              {/* Botón de escritorio (Opcional mantenerlo aquí también) */}
              {event.requires_registration && (
                <Link
                  href={`/eventos/${resolvedParams.slug}/registro`}
                  className="hidden md:flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-blue-700 text-white font-bold text-lg hover:bg-blue-800 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-700/30 transition-all duration-300"
                >
                  Registrarme Ahora
                </Link>
              )}
            </div>

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

      {/* --- BOTÓN FLOTANTE (FAB) PARA REGISTRO --- */}
      {event.requires_registration && (
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

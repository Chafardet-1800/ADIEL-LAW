import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getEventoById, getIdFromSlug } from "@/src/services/publicData";

// Tipado estricto para App Router moderno
type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. METADATA DINÁMICA
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const event = await getEventoById(id);

  if (!event) {
    return { title: "Evento no encontrado | Red ADIEL" };
  }

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

  // Usamos el servicio centralizado (con caché)
  const event = await getEventoById(id);

  // Programación defensiva por si alguien entra a una URL de un evento eliminado
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <h1 className="text-2xl font-bold text-zinc-900">
          Evento no encontrado
        </h1>
      </div>
    );
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

  return (
    <article className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Banner del evento */}
        <div className="w-full h-64 md:h-[400px] rounded-3xl overflow-hidden mb-8 relative bg-zinc-900">
          {event.images && event.images.length > 0 ? (
            <Image
              src={event.images[0]}
              alt={event.name}
              className="w-full h-full object-cover opacity-60"
              width={1200}
              height={630}
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-[#0000fe] opacity-50" />
          )}
          <div className="absolute inset-0 flex items-end p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
              {event.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: Detalles y Cronograma */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
              <h2 className="text-2xl font-bold mb-4 text-zinc-900">
                Sobre el evento
              </h2>
              <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </section>

            {/* Cronograma (active_schedule) */}
            {event.active_schedule && event.active_schedule.length > 0 && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <h2 className="text-2xl font-bold mb-6 text-zinc-900">
                  Cronograma
                </h2>
                <div className="space-y-3">
                  {event.active_schedule.map((item, index) => {
                    const start = new Date(item.start_time).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    );
                    const end = new Date(item.end_time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={index}
                        className="flex gap-4 items-start p-4 rounded-2xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-colors"
                      >
                        <div className="w-24 flex-shrink-0 text-[#0000fe] font-bold text-sm bg-blue-50 py-1.5 px-3 rounded-lg text-center">
                          {start} - {end}
                        </div>
                        <div className="pt-1">
                          <h4 className="font-bold text-zinc-900">
                            {item.active_name}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Columna Derecha: Tarjeta de Registro y Entregables */}
          <div className="space-y-6">
            {/* Tarjeta de Registro */}
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-zinc-200 sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-zinc-900">
                Detalles de Registro
              </h3>

              {event.lead && (
                <div className="mb-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
                    Líder del Evento
                  </p>
                  <p className="text-sm font-bold text-zinc-900">
                    {event.lead.name} {event.lead.lastname}
                  </p>
                </div>
              )}

              {event.requires_registration && (
                <Link
                  href={`/eventos/${event.id}/registro`}
                  className="block w-full py-4 text-center rounded-xl bg-[#0000fe] text-white font-bold hover:bg-[#012f6e] hover:shadow-lg transition-all"
                >
                  Registrarme Ahora
                </Link>
              )}
            </div>

            {/* Nueva Sección: Deliverables (Entregables) */}
            {event.deliverables && event.deliverables.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200">
                <h3 className="text-lg font-bold mb-4 text-zinc-900">
                  Incluye:
                </h3>
                <ul className="space-y-3">
                  {event.deliverables.map((item, idx) => (
                    <li
                      key={item.id || idx}
                      className="flex items-start gap-3 text-sm text-zinc-700"
                    >
                      <span className="text-[#0000fe] mt-0.5">✓</span>
                      <span>
                        <span className="font-semibold text-zinc-900">
                          {item.name}
                        </span>
                        {item.total_quota > 1 && ` (x${item.total_quota})`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

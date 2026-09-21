/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Función utilitaria para extraer el ID del final de la URL
function getIdFromSlug(slug: string) {
  // Separa el string por guiones y toma el último elemento (que es nuestro ID de Mongo)
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

async function getEventData(params: { slug: string }) {
  const id = getIdFromSlug(params.slug);
  // const res = await fetch(`https://tuapi.com/iglesias/${id}`);
  // return res.json();
  return {
    metadata: {
      created_date: "2026-06-23T20:19:29.958Z",
      update_date: "2026-06-23T20:22:52.933Z",
      is_deleted: false,
    },
    active_schedule: [
      {
        active_name: "Bienvenida",
        start_time: "2026-06-23T09:00:00.000Z",
        end_time: "2026-06-23T09:20:00.000Z",
      },
      {
        active_name: "Recreacion",
        start_time: "2026-06-23T09:25:00.000Z",
        end_time: "2026-06-23T10:00:00.000Z",
      },
      {
        active_name: "Taller nueva vida en cristo",
        start_time: "2026-06-23T10:00:00.000Z",
        end_time: "2026-06-23T12:00:00.000Z",
      },
      {
        active_name: "Adoracion",
        start_time: "2026-06-23T12:00:00.000Z",
        end_time: "2026-06-23T12:15:00.000Z",
      },
      {
        active_name: "Despedida",
        start_time: "2026-06-23T12:15:00.000Z",
        end_time: "2026-06-23T12:30:00.000Z",
      },
    ],
    form_fields: [
      {
        name: "Es alergico a algo? A que?",
        key: "alergias",
        pattern: null,
        placeholder: null,
        required: true,
        type: "text",
        list_value: [],
      },
      {
        name: "Comprobante de pago",
        key: "pago",
        pattern: null,
        placeholder: null,
        required: true,
        type: "file",
        list_value: [],
      },
    ],
    deliverables: [
      {
        id: "",
        name: "Guia de estudio, Nueva vida en Cristo",
        total_quota: 1,
      },
    ],
    id: "6a3aea52d93f353bea201370",
    name: "unoasdasds",
    description: "adsdas asdasdav asdasc",
    event_type: "MEETING",
    init_date: "2026-06-23T00:00:00.000Z",
    end_date: "2026-06-23T00:00:00.000Z",
    images: [
      "https://cityapp-pro.s3.us-east-2.amazonaws.com/images/1782245719721-228899350.jpg",
    ],
    documents: [
      "https://cityapp-pro.s3.us-east-2.amazonaws.com/images/1782245720042-90031896.pdf",
    ],
    created_by: "6a355ef9a5312bad6e0c8d6b",
    event_lead: "6a355ef9a5312bad6e0c8d6b",
    requires_registration: true,
    institution_ids: ["6a34069212e162f7628c0779"],
    participant_ids: [],
    creator: {
      name: "Anibal",
    },
    lead: {
      name: "Anibal",
      lastname: "Chafardet",
      phone_number: "04242990601",
    },
    institutions: [
      {
        name: "ADIEL",
      },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event: any = await getEventData(params);
  return {
    title: event.name,
    description: event.description,
    openGraph: { images: [event.images[0]] },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event: any = await getEventData(params);

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

      <div className="max-w-4xl mx-auto px-4">
        {/* Banner del evento */}
        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 relative">
          <Image
            src={event.images[0]}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              {event.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: Detalles y Cronograma */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
              <h2 className="text-2xl font-bold mb-4">Sobre el evento</h2>
              <p className="text-zinc-700 whitespace-pre-wrap">
                {event.description}
              </p>
            </section>

            {/* Cronograma (active_schedule) */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
              <h2 className="text-2xl font-bold mb-6">Cronograma</h2>
              <div className="space-y-4">
                {event.active_schedule.map((item: any, index: number) => {
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
                      className="flex gap-4 items-start p-4 rounded-xl hover:bg-zinc-50 transition"
                    >
                      <div className="w-24 flex-shrink-0 text-[#0000fe] font-bold text-sm">
                        {start} - {end}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">
                          {item.active_name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Columna Derecha: Tarjeta de Registro */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 border border-zinc-200 sticky top-24">
              <h3 className="text-xl font-bold mb-2">Detalles de Registro</h3>
              <p className="text-sm text-zinc-600 mb-6">
                Liderado por: {event.lead.name} {event.lead.lastname}
              </p>

              {event.requires_registration && (
                <Link
                  href={`/eventos/${event.id}/registro`}
                  className="block w-full py-4 text-center rounded-xl bg-[#0000fe] text-white font-bold hover:bg-[#012f6e] transition-colors"
                >
                  Registrarme Ahora
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

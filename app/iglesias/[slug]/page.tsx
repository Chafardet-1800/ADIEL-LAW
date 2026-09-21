/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Image from "next/image";

// Función utilitaria para extraer el ID del final de la URL
function getIdFromSlug(slug: string) {
  // Separa el string por guiones y toma el último elemento (que es nuestro ID de Mongo)
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

// Simulamos la llamada a tu API
async function getChurchData(params: { slug: string }) {
  const id = getIdFromSlug(params.slug);
  // const res = await fetch(`https://tuapi.com/iglesias/${id}`);
  // return res.json();
  return {
    location: {
      coordinates: [-66.9036, 10.4806],
      type: "Point",
    },
    metadata: {
      created_at: "2026-06-09T17:53:38.574Z",
      is_deleted: false,
      updated_at: "2026-06-09T17:53:38.574Z",
    },
    social_links: {
      facebook: null,
      instagram: null,
      tiktok: null,
      x: null,
    },
    id: "6a285322706bc80045db1aff",
    name: "Iglesia Bautista Central",
    address: "Av. Principal con Calle 2, Caracas, Miranda",
    building_images: ["https://midominio.com/fachada.jpg"],
    entity_type: "CHURCH",
    history: "Nuestra iglesia fue fundada en 1950...",
    logo_url: "https://midominio.com/logo-iglesia.png",
    members_images: [],
    mission: "Compartir la palabra de Dios.",
    slogan: "Luz en la ciudad",
    url_maps: "https://maps.app.goo.gl/ejemplo",
    vision: "Alcanzar a toda la comunidad.",
    event_ids: [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const church = await getChurchData(params);
  return {
    title: church.name,
    description: church.mission || church.history.substring(0, 150),
    openGraph: {
      title: church.name,
      images: [church.building_images[0] || church.logo_url],
    },
  };
}

export default async function ChurchDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const church: any = await getChurchData(params);

  // Datos estructurados para Google (LocalBusiness/Church)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: church.name,
    image: church.building_images,
    address: {
      "@type": "PostalAddress",
      streetAddress: church.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: church.location.coordinates[1],
      longitude: church.location.coordinates[0],
    },
  };

  return (
    <article className="min-h-screen bg-zinc-50 pt-24 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Cabecera */}
        <header className="flex flex-col md:flex-row gap-8 items-center mb-12">
          {church.logo_url && (
            <Image
              src={church.logo_url}
              alt={`Logo de ${church.name}`}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full shadow-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 mb-2">
              {church.name}
            </h1>
            <p className="text-lg text-zinc-600 italic">
              &quot;{church.slogan}&quot;
            </p>
            <p className="text-zinc-500 mt-2 flex items-center gap-2">
              📍 {church.address}
            </p>
          </div>
        </header>

        {/* Contenido principal: Historia y Misión */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">
            Nuestra Historia
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-8">{church.history}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-[#0000fe] mb-2">Misión</h3>
              <p className="text-zinc-700">{church.mission}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-[#0000fe] mb-2">Visión</h3>
              <p className="text-zinc-700">{church.vision}</p>
            </div>
          </div>
        </section>

        {/* Mapa de Google */}
        <section className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-200">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4 px-4">
            Ubicación
          </h2>
          <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-zinc-100">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              // Usamos las coordenadas para centrar el mapa
              src={`https://www.google.com/maps/embed/v1/place?key=TU_API_KEY_DE_GOOGLE&q=${church.location.coordinates[1]},${church.location.coordinates[0]}`}
            />
          </div>
        </section>
      </div>
    </article>
  );
}

import {
  getIdFromSlug,
  getInstitutionById,
  getEventsByInstitutionId,
  getPosts,
  Post,
} from "@/src/services/publicData";
import { Metadata } from "next";
import RecentEvents from "@/src/components/RecentEvents";
import RecentPosts from "@/src/components/RecentPosts";
import Image from "next/image";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 1. GENERACIÓN DE METADATA (Se mantiene igual)
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const church = await getInstitutionById(id);

  if (!church) return { title: "Iglesia no encontrada | Red ADIEL" };

  const ogImage =
    church.building_images?.[0] ||
    church.logo_url ||
    "/default-placeholder.jpg";

  return {
    title: `${church.name} | Red ADIEL`,
    description:
      church.mission ||
      church.history?.substring(0, 150) ||
      "Conoce nuestra iglesia.",
    openGraph: {
      title: church.name,
      images: ogImage !== "/default-placeholder.jpg" ? [ogImage] : [],
    },
  };
}

// 2. COMPONENTE PRINCIPAL
export default async function ChurchDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);

  // OBTENCIÓN DE DATOS EN PARALELO
  // Buscamos la iglesia, sus eventos, y todas las noticias cacheadas al mismo tiempo
  const [church, churchEvents, allPosts] = await Promise.all([
    getInstitutionById(id),
    getEventsByInstitutionId(id),
    getPosts(id),
  ]);

  console.log(church, churchEvents, allPosts);

  if (!church) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50/50">
        <h1 className="text-2xl font-bold text-blue-950">
          Iglesia no encontrada.
        </h1>
      </div>
    );
  }

  // Filtramos los posts en memoria (Manejamos institution_id por si tu BD usa snake_case o camelCase)
  const churchPosts = allPosts.filter(
    (post: Post) => post.institution_id === id,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: church.name,
    image: church.building_images || [],
    address: {
      "@type": "PostalAddress",
      streetAddress: church.address,
    },
    geo: church.location?.coordinates
      ? {
          "@type": "GeoCoordinates",
          latitude: church.location.coordinates[1],
          longitude: church.location.coordinates[0],
        }
      : undefined,
  };

  const heroImage = church.building_images?.[0];

  return (
    <article className="min-h-screen bg-linear-to-b from-blue-50/50 via-white to-blue-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --- HERO SECTION --- */}
      <header className="relative w-full h-80 md:h-112.5 bg-blue-950 overflow-hidden flex items-end justify-center rounded-b-[3rem] shadow-2xl shadow-blue-900/10 mb-20 z-10">
        {heroImage ? (
          <>
            <Image
              src={heroImage}
              alt={`Fachada de ${church.name}`}
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
              width={1920}
              height={1080}
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-blue-950 via-blue-900/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-tr from-blue-950 via-blue-900 to-blue-800 opacity-90" />
        )}
      </header>

      <div className="max-w-5xl mx-auto px-4 -mt-44 relative z-20">
        {/* --- TARJETA DE PERFIL --- */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mb-12">
          <div className="shrink-0 relative group">
            {church.logo_url ? (
              <Image
                src={church.logo_url}
                alt={`Logo de ${church.name}`}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg border-4 border-white object-cover bg-white group-hover:scale-105 transition-transform duration-500"
                width={160}
                height={160}
                priority
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg border-4 border-white bg-blue-50 flex items-center justify-center text-5xl font-extrabold text-blue-700 group-hover:scale-105 transition-transform duration-500">
                {church.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center h-full pt-2">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 mb-3 tracking-tight">
              {church.name}
            </h1>
            {church.slogan && (
              <p className="text-lg text-blue-700 font-semibold mb-4 tracking-wide">
                &quot;{church.slogan}&quot;
              </p>
            )}
            {church.address && (
              <p className="inline-flex items-center gap-2 text-zinc-700 font-medium px-4 py-2 bg-blue-50/50 rounded-full w-fit mx-auto md:mx-0 border border-blue-100">
                <span className="text-blue-700 text-xl">📍</span>{" "}
                {church.address}
              </p>
            )}
          </div>
        </div>

        {/* --- HISTORIA --- */}
        {church.history && (
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-blue-50 mb-12 hover:shadow-lg hover:shadow-blue-900/5 transition-shadow duration-300">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 text-xl">
                📖
              </span>
              Nuestra Historia
            </h2>
            <div className="text-zinc-700 leading-relaxed font-medium whitespace-pre-wrap">
              {church.history}
            </div>
          </section>
        )}

        {/* --- MISIÓN Y VISIÓN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {church.mission && (
            <div className="bg-blue-700 p-8 md:p-10 rounded-[2.5rem] shadow-lg shadow-blue-700/20 text-white transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-extrabold mb-4 flex items-center gap-3">
                <span className="text-3xl opacity-90">🎯</span> Misión
              </h3>
              <p className="text-blue-50 leading-relaxed font-medium">
                {church.mission}
              </p>
            </div>
          )}

          {church.vision && (
            <div className="bg-blue-50 p-8 md:p-10 rounded-[2.5rem] border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-2xl font-extrabold text-blue-950 mb-4 flex items-center gap-3">
                <span className="text-3xl">👁️</span> Visión
              </h3>
              <p className="text-zinc-700 leading-relaxed font-medium">
                {church.vision}
              </p>
            </div>
          )}
        </div>

        {/* --- NUEVA SECCIÓN: EVENTOS DE LA IGLESIA --- */}
        {churchEvents.length > 0 && (
          <section className="mb-12 bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white shadow-sm hover:shadow-lg hover:shadow-blue-900/5 transition-shadow duration-300">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-blue-950 mb-3 flex items-center gap-3">
                <span className="text-blue-700">🗓️</span> Próximos Eventos
              </h2>
              <p className="text-lg text-zinc-700 font-medium">
                Acompáñanos en nuestras próximas actividades y reuniones.
              </p>
            </div>
            {/* Reutilizamos el componente del Home */}
            <RecentEvents events={churchEvents} />
          </section>
        )}

        {/* --- NOTICIAS Y PUBLICACIONES --- */}
        {churchPosts.length > 0 && (
          <section className="mb-12 bg-linear-to-br from-blue-950 to-blue-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl text-white overflow-hidden relative">
            {/* Elemento de cristal decorativo para el fondo oscuro */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-3 flex items-center gap-3">
                <span className="text-blue-300">📰</span> Últimas Publicaciones
              </h2>
              <p className="text-lg text-blue-200 font-medium">
                Anuncios, devocionales y noticias de nuestra congregación.
              </p>
            </div>
            {/* Reutilizamos el componente del Home */}
            <RecentPosts posts={churchPosts} />
          </section>
        )}

        {/* --- MAPA DE UBICACIÓN --- */}
        {church.location?.coordinates && (
          <section className="bg-white/60 backdrop-blur-md p-4 rounded-[2.5rem] shadow-lg shadow-blue-900/5 border border-white">
            <h2 className="text-2xl font-extrabold text-blue-950 mb-4 px-6 pt-4">
              Ubicación
            </h2>
            <div className="w-full h-100 rounded-[2rem] overflow-hidden bg-blue-50 border-4 border-white shadow-inner">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=TU_API_KEY_DE_GOOGLE&q=${church.location.coordinates[1]},${church.location.coordinates[0]}`}
              />
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

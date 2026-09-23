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

// 1. GENERACIÓN DE METADATA DINÁMICA SEGURA
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const unit = await getInstitutionById(id);

  if (!unit) {
    return {
      title: "Unidad no encontrada | Red ADIEL",
      description: "La unidad que estás buscando no existe.",
    };
  }

  const fallbackDescription = unit.history
    ? unit.history.substring(0, 150) + "..."
    : "Conoce más sobre nuestra unidad de servicio.";

  // Evitamos errores de arreglo vacío en openGraph
  const ogImage =
    unit.logo_url ||
    (unit.members_images && unit.members_images[0]) ||
    "/default-placeholder.jpg";

  return {
    title: `${unit.name} | Red ADIEL`,
    description: unit.mission || fallbackDescription,
    openGraph: {
      title: unit.name,
      description: unit.mission || fallbackDescription,
      images: ogImage !== "/default-placeholder.jpg" ? [ogImage] : [],
    },
  };
}

// 2. COMPONENTE PRINCIPAL
export default async function ServiceUnitDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);

  // OBTENCIÓN DE DATOS EN PARALELO (Unidad, Eventos, Posts)
  const [unit, unitEvents, allPosts] = await Promise.all([
    getInstitutionById(id),
    getEventsByInstitutionId(id),
    getPosts(),
  ]);

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50/50">
        <h1 className="text-2xl font-bold text-blue-950">
          Unidad de servicio no encontrada.
        </h1>
      </div>
    );
  }

  // Filtrar los posts que pertenecen a esta unidad
  const unitPosts = allPosts.filter((post: Post) => post.institution_id === id);

  // SEO: Datos Estructurados
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: unit.name,
    description: unit.mission || unit.history,
    logo: unit.logo_url,
    url: `https://tudominio.com/unidades/${resolvedParams.slug}`,
    sameAs: [
      unit.social_links?.facebook,
      unit.social_links?.instagram,
      unit.social_links?.tiktok,
      unit.social_links?.x,
    ].filter(Boolean),
  };

  // En Unidades de Servicio, members_images suele ser la foto del equipo/ministerio
  const heroImage = unit.members_images?.[0] || unit.building_images?.[0];

  return (
    <article className="min-h-screen bg-linear-to-b from-blue-50/50 via-white to-blue-50 pb-20">
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
              alt={`Equipo de ${unit.name}`}
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
      <div className="max-w-5xl mx-auto px-4 -mt-44 relative z-20">
        {/* CABECERA: Perfil y Redes Sociales Integradas */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-900/5 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mb-12 relative overflow-hidden">
          <div className="shrink-0 relative group z-10">
            {unit.logo_url ? (
              <Image
                src={unit.logo_url}
                alt={`Logo de ${unit.name}`}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg border-4 border-white object-cover bg-white group-hover:scale-105 transition-transform duration-500"
                width={160}
                height={160}
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg border-4 border-white bg-blue-50 flex items-center justify-center text-5xl font-extrabold text-blue-700 group-hover:scale-105 transition-transform duration-500 uppercase">
                {unit.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center h-full pt-2 w-full z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 mb-3 tracking-tight">
              {unit.name}
            </h1>
            {unit.slogan && (
              <p className="text-lg text-blue-700 font-semibold mb-6 tracking-wide">
                &quot;{unit.slogan}&quot;
              </p>
            )}

            {/* Redes Sociales como píldoras elegantes */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-auto">
              {unit.social_links?.facebook && (
                <a
                  href={unit.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-[#1877F2] text-blue-700 hover:text-white rounded-full transition-all duration-300 shadow-sm border border-blue-100 font-semibold text-sm group"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </a>
              )}
              {unit.social_links?.instagram && (
                <a
                  href={unit.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-[#E4405F] text-blue-700 hover:text-white rounded-full transition-all duration-300 shadow-sm border border-blue-100 font-semibold text-sm group"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* --- HISTORIA --- */}
        {unit.history && (
          <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-blue-50 mb-12 hover:shadow-lg hover:shadow-blue-900/5 transition-shadow duration-300">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 text-xl">
                📖
              </span>
              Nuestra Historia
            </h2>
            <div className="text-zinc-700 leading-relaxed font-medium whitespace-pre-wrap">
              {unit.history}
            </div>
          </section>
        )}

        {/* --- MISIÓN Y VISIÓN (Alto Contraste) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {unit.mission && (
            <div className="bg-blue-700 p-8 md:p-10 rounded-[2.5rem] shadow-lg shadow-blue-700/20 text-white transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-extrabold mb-4 flex items-center gap-3">
                <span className="text-3xl opacity-90">🎯</span> Misión
              </h3>
              <p className="text-blue-50 leading-relaxed font-medium">
                {unit.mission}
              </p>
            </div>
          )}

          {unit.vision && (
            <div className="bg-blue-50 p-8 md:p-10 rounded-[2.5rem] border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-2xl font-extrabold text-blue-950 mb-4 flex items-center gap-3">
                <span className="text-3xl">👁️</span> Visión
              </h3>
              <p className="text-zinc-700 leading-relaxed font-medium">
                {unit.vision}
              </p>
            </div>
          )}
        </div>

        {/* --- EVENTOS DE LA UNIDAD DE SERVICIO --- */}
        {unitEvents.length > 0 && (
          <section className="mb-12 bg-white/40 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white shadow-sm hover:shadow-lg hover:shadow-blue-900/5 transition-shadow duration-300">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-blue-950 mb-3 flex items-center gap-3">
                <span className="text-blue-700">🗓️</span> Eventos y Actividades
              </h2>
              <p className="text-lg text-zinc-700 font-medium">
                Acompáñanos en los eventos organizados por este ministerio.
              </p>
            </div>
            <RecentEvents events={unitEvents} />
          </section>
        )}

        {/* --- NOTICIAS Y PUBLICACIONES --- */}
        {unitPosts.length > 0 && (
          <section className="mb-12 bg-linear-to-br from-blue-950 to-blue-900 p-8 md:p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-3 flex items-center gap-3">
                <span className="text-blue-300">📰</span> Últimas Publicaciones
              </h2>
              <p className="text-lg text-blue-200 font-medium">
                Anuncios y devocionales de esta unidad de servicio.
              </p>
            </div>
            <RecentPosts posts={unitPosts} />
          </section>
        )}
      </div>
    </article>
  );
}

import { getIdFromSlug, getInstitutionById } from "@/services/publicData";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

//GENERACIÓN DE METADATA DINÁMICA (El Santo Grial del SEO)
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
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

  return {
    title: `${unit.name} | Red ADIEL`,
    description: unit.mission || fallbackDescription,
    openGraph: {
      title: unit.name,
      description: unit.mission || fallbackDescription,
      images: [
        unit.logo_url ||
          (unit.members_images && unit.members_images[0]) ||
          "/default-og.jpg",
      ],
    },
  };
}

// 4. COMPONENTE PRINCIPAL (Server Component Puro)
export default async function ServiceUnitDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const id = getIdFromSlug(params.slug);
  const unit = await getInstitutionById(id);

  if (!unit) {
    return (
      <article className="min-h-screen bg-zinc-50 pb-20">
        <header className="relative w-full h-80 md:h-[400px] bg-zinc-900 overflow-hidden">
          <Image
            src="/default-og.jpg"
            alt="Unidad no encontrada"
            className="w-full h-full object-cover"
            width={1200}
            height={630}
          />
        </header>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-zinc-900 mt-12 mb-6">
            Unidad no encontrada
          </h1>
          <p className="text-lg text-zinc-600">
            La unidad que est&aacute;s buscando no existe.
          </p>
        </div>
      </article>
    );
  }

  // SEO: Datos Estructurados para Google (Tipo: Organization)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: unit.name,
    description: unit.mission || unit.history,
    logo: unit.logo_url,
    url: `https://tudominio.com/unidades/${params.slug}`,
    sameAs: [
      unit.social_links?.facebook,
      unit.social_links?.instagram,
      unit.social_links?.tiktok,
      unit.social_links?.x,
    ].filter(Boolean), // Filtra los nulls automáticamente
  };

  return (
    <article className="min-h-screen bg-zinc-50 pb-20">
      {/* Inyección del JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER / HERO SECTION */}
      <header className="relative w-full h-80 md:h-[400px] bg-zinc-900 overflow-hidden">
        {/* Imagen de fondo (Usamos members_images si hay, sino fallback) */}
        {unit.members_images && unit.members_images.length > 0 ? (
          <Image
            src={unit.members_images[0]}
            alt={`Equipo de ${unit.name}`}
            className="w-full h-full object-cover opacity-40"
            width={800}
            height={400}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-[#0000fe] opacity-50" />
        )}

        {/* Contenido del Header */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {unit.logo_url && (
            <Image
              src={unit.logo_url}
              alt={`Logo ${unit.name}`}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl mb-4 bg-white object-contain"
              width={128}
              height={128}
              unoptimized
            />
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {unit.name}
          </h1>
          {unit.slogan && (
            <p className="mt-3 text-lg md:text-xl text-blue-100 font-medium tracking-wide">
              &quot;{unit.slogan}&quot;
            </p>
          )}
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        {/* Barra de Acciones y Redes Sociales */}
        <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            {unit.social_links?.facebook && (
              <a
                href={unit.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#1877F2] transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
            )}
            {unit.social_links?.instagram && (
              <a
                href={unit.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-[#E4405F] transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z" />
                </svg>
              </a>
            )}
          </div>

          {/* Si tiene eventos asociados, mostramos un botón para verlos */}
          {unit.event_ids && unit.event_ids.length > 0 && (
            <Link
              href="#eventos"
              className="px-6 py-2 bg-blue-50 text-[#0000fe] font-bold rounded-full hover:bg-blue-100 transition"
            >
              Ver {unit.event_ids.length} Evento(s)
            </Link>
          )}
        </div>

        {/* Sección: Misión y Visión (Grid de 2 columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {unit.mission && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-blue-50 text-[#0000fe] rounded-xl flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">
                Nuestra Misión
              </h2>
              <p className="text-zinc-600 leading-relaxed">{unit.mission}</p>
            </section>
          )}

          {unit.vision && (
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
              <div className="w-12 h-12 bg-blue-50 text-[#0000fe] rounded-xl flex items-center justify-center text-2xl mb-4">
                👁️
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-3">
                Nuestra Visión
              </h2>
              <p className="text-zinc-600 leading-relaxed">{unit.vision}</p>
            </section>
          )}
        </div>

        {/* Sección: Historia (Ancho completo) */}
        {unit.history && (
          <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-100">
            <h2 className="text-3xl font-bold text-zinc-900 mb-6">
              Nuestra Historia
            </h2>
            <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed">
              {/* Si la historia viene con saltos de línea del backend, esto los respeta */}
              <p className="whitespace-pre-wrap">{unit.history}</p>
            </div>
          </section>
        )}
      </main>
    </article>
  );
}

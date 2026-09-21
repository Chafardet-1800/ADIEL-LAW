import Link from "next/link";
import Image from "next/image"; // Recomendado para optimizar imágenes si los dominios están configurados
import { Institution } from "@/services/publicData";

// Función utilitaria para generar el slug SEO-friendly
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function ServiceUnits({ units }: { units: Institution[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.map((unit) => {
        // Generamos la URL Híbrida (Slug + ID para SEO - Punto 3)
        const unitUrl = `/unidades/${slugify(unit.name)}-${unit.id}`;

        // Definimos qué texto mostrar como descripción corta (Priorizamos misión, luego historia)
        const displayDescription =
          unit.mission || unit.history || "Sirviendo a nuestra comunidad.";

        return (
          <Link
            href={unitUrl}
            key={unit.id}
            className="group relative flex flex-col p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-white shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            {/* Decoración de fondo al hacer hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0000fe]/5 rounded-full blur-2xl group-hover:bg-[#0000fe]/20 transition-colors duration-500 -mr-10 -mt-10" />

            {/* 2. RENDERIZADO DEL LOGO (Manejo de logo_url real o fallback) */}
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 border border-zinc-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden relative">
              {unit.logo_url ? (
                <Image
                  src={unit.logo_url}
                  alt={`Logo de ${unit.name}`}
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                  unoptimized
                />
              ) : (
                // Fallback: Si no tiene logo, mostramos la primera letra de su nombre
                <span className="text-[#0000fe] font-black text-2xl uppercase">
                  {unit.name.charAt(0)}
                </span>
              )}
            </div>

            {/* 3. CONTENIDO TEXTUAL */}
            <h3 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-[#0000fe] transition-colors relative z-10">
              {unit.name}
            </h3>

            {/* Si la unidad tiene un slogan, le da un toque muy corporativo y bonito */}
            {unit.slogan && (
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0000fe] mb-3 relative z-10 block">
                {unit.slogan}
              </span>
            )}

            <p className="text-zinc-600 line-clamp-3 relative z-10 mb-6 mt-2">
              {displayDescription}
            </p>

            {/* Call to Action Integrado */}
            <div className="mt-auto flex items-center text-sm font-bold text-[#0000fe] opacity-80 group-hover:opacity-100 relative z-10">
              Conocer más
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

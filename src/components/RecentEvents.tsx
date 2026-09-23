import Link from "next/link";
import { Event } from "@/src/services/publicData"; // Importamos la interfaz que creamos en el servicio
import Image from "next/image";

// Utilidad para URLs amigables con SEO
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

export default function RecentEvents({ events }: { events: Event[] }) {
  // Defensa: Si no hay eventos, podemos mostrar un mensaje sutil o simplemente no renderizar nada
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 bg-white/50 rounded-2xl border border-white/60">
        Pronto anunciaremos nuevos eventos. ¡Mantente atento!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => {
        // 1. URL Híbrida para SEO perfecto
        const eventUrl = `/eventos/${slugify(event.name)}-${event.id}`;

        // 2. Formateo de fecha para el Badge (Ej: "23 jun")
        const startDate = new Date(event.init_date);
        const day = startDate.toLocaleDateString("es-ES", { day: "numeric" });
        const month = startDate.toLocaleDateString("es-ES", { month: "short" });

        return (
          <article
            key={event.id}
            className="group relative bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-2 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
          >
            {/* Contenedor de Imagen */}
            <div className="w-full h-48 bg-zinc-200 rounded-xl overflow-hidden relative">
              {event.images && event.images.length > 0 ? (
                <Image
                  src={event.images[0]}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  width={300}
                  height={300}
                  unoptimized
                />
              ) : (
                // Fallback si el evento no tiene imagen
                <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-[#0000fe] opacity-80" />
              )}

              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

              {/* Badge de Fecha */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0000fe] capitalize shadow-sm">
                {day} {month}
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-[#0000fe] transition-colors line-clamp-2">
                {event.name}
              </h3>

              <p className="text-sm text-zinc-600 mb-6 line-clamp-2">
                {event.description}
              </p>

              {/* Botón CTA - Lo empujamos hacia abajo con mt-auto */}
              <Link
                href={eventUrl}
                className="mt-auto inline-block w-full text-center py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold group-hover:bg-[#0000fe] group-hover:text-white transition-colors"
              >
                Ver Detalles
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

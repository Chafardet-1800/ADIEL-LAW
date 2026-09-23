import { Post } from "@/src/services/publicData";
import Image from "next/image";
import Link from "next/link";

export default function RecentPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => {
        // Mantenemos nuestra estrategia (Punto 3): slug del backend + ID
        const postUrl = `/post/${post.slug}-${post.id}`;

        // Formateamos la fecha para que sea legible (Ej: "9 de junio de 2026")
        const formattedDate = new Date(
          post.metadata.published_at,
        ).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <Link
            href={postUrl}
            key={post.id}
            className="group flex flex-col bg-white backdrop-blur-md border border-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Contenedor de la Imagen */}
            <div className="w-full h-48 relative overflow-hidden bg-zinc-200">
              {post.images && post.images.length > 0 ? (
                <Image
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  width={400}
                  height={200}
                  unoptimized
                />
              ) : (
                /* Fallback elegante si el post no tiene imagen (Gradient dinámico) */
                <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-[#0000fe] opacity-80 flex items-center justify-center">
                  <span className="text-white/50 text-4xl">📰</span>
                </div>
              )}

              {/* Etiquetas flotantes (Tags) */}
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#0000fe] text-xs font-bold rounded-full shadow-sm capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contenido del Post */}
            <div className="p-6 flex flex-col flex-1">
              {/* Etiqueta <time> semántica: Vital para Google News y SEO */}
              <time
                dateTime={post.metadata.published_at}
                className="text-xs font-semibold text-zinc-500 mb-2"
              >
                {formattedDate}
              </time>

              <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-[#0000fe] transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-zinc-600 line-clamp-3 mb-6 text-sm">
                {post.content}
              </p>

              <div className="mt-auto flex items-center text-sm font-bold text-[#0000fe] group-hover:underline">
                Leer artículo completo →
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

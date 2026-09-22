// src/app/(public)/noticias/[slug]/page.tsx
import { getIdFromSlug, getPostById } from "@/src/services/publicData";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Tipado de la Promesa para Next.js 15+
type PageProps = {
  params: Promise<{ slug: string }>;
};

// 3. METADATA DINÁMICA
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const post = await getPostById(id);

  if (!post || !post.metadata.is_published) {
    return { title: "Publicación no encontrada | Red ADIEL" };
  }

  // Utilizamos el meta_description que provee el backend, o un fragmento del contenido
  const description =
    post.meta_description || post.content.substring(0, 160) + "...";

  return {
    title: `${post.title} | ${post.institution.name}`,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      publishedTime: post.metadata.published_at,
      authors: [`${post.author.name} ${post.author.lastname}`],
      images: post.images && post.images.length > 0 ? [post.images[0]] : [],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

// 4. COMPONENTE PRINCIPAL
export default async function PostDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const post = await getPostById(id);

  if (!post || !post.metadata.is_published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <h1 className="text-2xl font-bold text-zinc-900">
          La publicación no existe o fue eliminada.
        </h1>
      </div>
    );
  }

  // Formateo de fechas para UI y SEO
  const publishDate = new Date(post.metadata.published_at);
  const formattedDate = publishDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // SEO: Datos Estructurados tipo BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.images,
    datePublished: post.metadata.published_at,
    dateModified: post.metadata.update_date,
    author: {
      "@type": "Person",
      name: `${post.author.name} ${post.author.lastname}`,
    },
    publisher: {
      "@type": "Organization",
      name: post.institution.name,
      logo: {
        "@type": "ImageObject",
        url: "https://tudominio.com/logo.png", // Reemplazar con el logo global de la app
      },
    },
    description: post.meta_description,
  };

  return (
    <article className="min-h-screen bg-zinc-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER / HERO (Enfocado en la lectura) */}
      <header className="w-full bg-white border-b border-zinc-200 pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Categoría / Institución */}
          <Link
            href={`/unidades/${post.institution_id}`} // Asumiendo que el ID enruta correctamente
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 text-[#0000fe] text-sm font-bold tracking-wide uppercase hover:bg-blue-100 transition-colors"
          >
            {post.institution.name}
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

          {/* Byline (Autor y Fecha) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-zinc-600 font-medium">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 font-bold">
                {post.author.name.charAt(0)}
                {post.author.lastname.charAt(0)}
              </div>
              <span className="text-zinc-900 font-bold">
                {post.author.name} {post.author.lastname}
              </span>
            </div>
            <span className="hidden sm:block text-zinc-300">•</span>
            <time dateTime={post.metadata.published_at}>{formattedDate}</time>
          </div>
        </div>
      </header>

      {/* IMAGEN PRINCIPAL (Si existe) */}
      {post.images && post.images.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 mb-12">
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-zinc-200">
            <Image
              src={post.images[0]}
              alt={`Imagen destacada de: ${post.title}`}
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
              priority
            />
          </div>
        </div>
      )}

      {/* CONTENIDO DEL POST */}
      <main className="max-w-3xl mx-auto px-4 mt-12">
        <div className="prose prose-lg prose-zinc prose-a:text-[#0000fe] max-w-none bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-100">
          {/* 
            El uso de whitespace-pre-wrap es vital aquí para 
            renderizar los \n\n como saltos de párrafo reales.
          */}
          <div className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* ETIQUETAS (TAGS) */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            <span className="text-sm font-bold text-zinc-500 mr-2 py-2">
              Etiquetas:
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-semibold rounded-full capitalize hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>
    </article>
  );
}

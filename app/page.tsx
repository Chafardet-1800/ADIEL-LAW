import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* 
        A11y Tip: Un enlace oculto al principio para que los usuarios 
        que navegan por teclado puedan saltar el menú 
      */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:p-4 focus:bg-[#0000fe] focus:text-white focus:absolute focus:z-50"
      >
        Saltar al contenido principal
      </a>

      {/* HEADER SEMÁNTICO (Hero Section) */}
      <header className="relative w-full py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4 bg-zinc-50 border-b border-zinc-200">
        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 max-w-4xl">
          Transformando la gestión de{" "}
          <span className="text-[#0000fe]">Eventos y Liderazgo</span>
        </h1>
        <p className="mt-6 text-lg text-zinc-600 max-w-2xl leading-relaxed">
          Descubre congresos, seminarios y actividades diseñadas para potenciar
          tu ministerio. Regístrate en segundos y obtén tu acreditación digital.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/eventos"
            className="px-8 py-3.5 rounded-full bg-[#0000fe] text-white font-bold hover:bg-[#012f6e] transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            aria-label="Ver próximos eventos"
          >
            Explorar Eventos
          </Link>
          <Link
            href="/nosotros"
            className="px-8 py-3.5 rounded-full bg-white text-zinc-900 border border-zinc-300 font-bold hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-4 focus:ring-zinc-500/30"
          >
            Conocer más
          </Link>
        </div>
      </header>

      {/* SECCIÓN SEMÁNTICA */}
      <section
        aria-labelledby="features-title"
        className="py-20 px-4 max-w-6xl mx-auto w-full"
      >
        <div className="text-center mb-16">
          <h2 id="features-title" className="text-3xl font-bold text-zinc-900">
            Por qué elegir nuestra plataforma
          </h2>
          <p className="mt-4 text-zinc-600">
            Todo lo que necesitas en un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <article className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              Registro Simplificado
            </h3>
            <p className="text-zinc-600">
              Completa tu información en menos de 2 minutos sin contraseñas
              complicadas.
            </p>
          </article>
          {/* Card 2 */}
          <article className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              Código QR Personal
            </h3>
            <p className="text-zinc-600">
              Accede a los eventos y reclama tus materiales mostrando tu pase
              digital desde el celular.
            </p>
          </article>
          {/* Card 3 */}
          <article className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              Notificaciones en Vivo
            </h3>
            <p className="text-zinc-600">
              Mantente al tanto de cambios de horario, nuevos materiales y
              anuncios importantes.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

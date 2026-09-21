import ChurchLocator from "@/components/ChurchLocator";
import RecentEvents from "@/components/RecentEvents";
import RecentPosts from "@/components/RecentPosts";
import ServiceUnits from "@/components/ServiceUnits";
import {
  getChurches,
  getEvents,
  getPosts,
  getServiceUnits,
} from "@/services/publicData";
import Link from "next/link";

export default async function HomePage() {
  // 1. OBTENCIÓN DE DATOS (Se ejecuta en el servidor)
  // Las 3 peticiones se hacen en paralelo (o se sacan de la caché al instante)
  const [churchesData, serviceUnitsData, postsData, eventsData] =
    await Promise.all([
      getChurches(),
      getServiceUnits(),
      getPosts(),
      getEvents(),
    ]);

  return (
    // Contenedor principal con un fondo de degradado suave y moderno
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50/30 to-zinc-100 overflow-hidden">
      {/* Elementos decorativos de fondo (Figuras borrosas/Glassmorphism) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#0000fe]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-[-5%] w-[30rem] h-[30rem] bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Enlace de accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:p-4 focus:bg-[#0000fe] focus:text-white focus:absolute focus:z-50"
      >
        Saltar al contenido principal
      </a>

      {/* --- 1. HERO SECTION (Introducción rápida) --- */}
      <header className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 flex flex-col items-center justify-center text-center px-4">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 text-[#0000fe] text-sm font-semibold mb-6 tracking-wide uppercase">
            Bienvenidos a ADIEL
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight">
            Uniendo liderazgo y <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000fe] to-blue-400">
              propósito en cada evento
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed mb-10">
            Descubre congresos, seminarios y actividades diseñadas para
            potenciar tu ministerio. Regístrate en segundos y obtén tu
            acreditación digital.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="#eventos"
              className="px-8 py-4 rounded-full bg-[#0000fe] text-white font-bold hover:bg-[#012f6e] hover:scale-105 transition-all shadow-lg shadow-blue-500/30"
            >
              Explorar Eventos
            </Link>
            <Link
              href="#asociacion"
              className="px-8 py-4 rounded-full bg-white/60 backdrop-blur-md text-zinc-900 border border-white/40 font-bold hover:bg-white/80 transition-all shadow-sm"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </header>

      {/* --- 2. INFORMACIÓN DE LA ASOCIACIÓN --- */}
      <section id="asociacion" className="py-24 px-4 w-full relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Tarjeta Glassmorphism */}
          <div className="p-8 md:p-12 rounded-3xl bg-white/50 backdrop-blur-xl border border-white shadow-xl shadow-zinc-200/50 transition-transform hover:-translate-y-2 duration-500">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
              ¿Qué es la Asociación ADIEL?
            </h2>
            <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
              Somos una red comprometida con el desarrollo integral del
              liderazgo. Nuestra misión es proveer herramientas, capacitación y
              espacios de conexión para que cada ministerio alcance su máximo
              potencial.
            </p>
            <ul className="space-y-4">
              {[
                "Red de apoyo continuo",
                "Capacitación teológica y práctica",
                "Eventos de alto impacto",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-zinc-700 font-medium"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#0000fe] flex items-center justify-center">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl group">
            {/* Aquí iría un componente <Image> de Next.js. Usamos un div simulado por ahora */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="w-full h-full bg-zinc-300 group-hover:scale-105 transition-transform duration-700 ease-in-out" />
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-white font-bold text-xl">
                Más de 20 años de trayectoria
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. UNIDADES DE SERVICIO --- */}
      <section id="unidades" className="py-24 px-4 w-full relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              Nuestras Unidades de Servicio
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              Descubre los diferentes ministerios y grupos que conforman nuestra
              asociación, diseñados para servir, enseñar y conectar a cada
              miembro de la familia.
            </p>
          </div>

          {/* Inyectamos el Bento Grid puramente estático (Server Component) */}
          <ServiceUnits units={serviceUnitsData} />
        </div>
      </section>

      {/* --- 4. MAPA DE IGLESIAS --- */}
      <section
        id="mapa"
        className="py-24 px-4 w-full bg-white/40 backdrop-blur-lg border-y border-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Nuestra Red de Iglesias
          </h2>
          <p className="text-lg text-zinc-600 mb-12 max-w-2xl mx-auto">
            Encuentra una congregación cerca de ti. Estamos presentes en
            múltiples ciudades, unidos por un mismo propósito. Utiliza el
            buscador o explora el mapa.
          </p>

          {/* 
            Aquí inyectamos el componente interactivo. 
            Le pasamos los datos pre-cargados por el servidor.
          */}
          <ChurchLocator churches={churchesData} />
        </div>
      </section>

      {/* --- 5. EVENTOS IMPORTANTES --- */}
      <section id="eventos" className="py-24 px-4 w-full relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Próximos Eventos
              </h2>
              <p className="text-lg text-zinc-600 max-w-xl">
                No te pierdas nuestras próximas reuniones, congresos y
                seminarios. Reserva tu lugar hoy mismo.
              </p>
            </div>

            <Link
              href="/eventos"
              className="text-[#0000fe] font-semibold hover:underline flex items-center gap-2 whitespace-nowrap"
            >
              Ver todos los eventos →
            </Link>
          </div>

          {/* 
            Inyectamos nuestro nuevo componente, 
            pasándole únicamente el arreglo recortado.
          */}
          <RecentEvents events={eventsData} />
        </div>
      </section>

      {/* --- 6. ÚLTIMAS NOTICIAS / POSTS --- */}
      <section
        id="noticias"
        className="py-24 px-4 w-full relative z-10 bg-white/30 backdrop-blur-sm border-t border-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                Últimas Noticias y Publicaciones
              </h2>
              <p className="text-lg text-zinc-600 max-w-xl">
                Mantente informado sobre campañas, devocionales y anuncios
                importantes de nuestras instituciones y unidades de servicio.
              </p>
            </div>

            {/* Este enlace llevaría a una página con todos los posts paginados */}
            <Link
              href="/noticias"
              className="px-6 py-3 rounded-full bg-white text-zinc-900 border border-zinc-300 font-bold hover:bg-zinc-100 hover:text-[#0000fe] transition-colors whitespace-nowrap shadow-sm"
            >
              Ver todas las noticias
            </Link>
          </div>

          {/* Inyectamos la grilla de posts */}
          <RecentPosts posts={postsData} />
        </div>
      </section>
    </div>
  );
}

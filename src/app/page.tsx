import ChurchLocator from "@/src/components/ChurchLocator";
import RecentEvents from "@/src/components/RecentEvents";
import RecentPosts from "@/src/components/RecentPosts";
import ServiceUnits from "@/src/components/ServiceUnits";
import {
  getChurches,
  getEvents,
  getPosts,
  getServiceUnits,
} from "@/src/services/publicData";
import Link from "next/link";

export default async function HomePage() {
  // 1. OBTENCIÓN DE DATOS
  const [churchesData, serviceUnitsData, postsData, eventsData] =
    await Promise.all([
      getChurches(),
      getServiceUnits(),
      getPosts(),
      getEvents(),
    ]);

  console.log(churchesData, serviceUnitsData, postsData, eventsData);

  return (
    // CAMBIO: Fondo general ahora usa tonos de azul pálido en lugar de zinc
    <div className="relative min-h-screen bg-linear-to-b from-blue-100 via-white to-blue-50 overflow-hidden selection:bg-blue-700 selection:text-white">
      {/* --- ELEMENTOS DECORATIVOS (Bolas de luz más intensas y azules) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-10000" />
      <div className="absolute top-[35%] right-[-5%] w-120 h-120 bg-blue-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-160 h-160 bg-blue-700/80 rounded-full blur-3xl pointer-events-none" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:p-4 focus:bg-blue-700 focus:text-white focus:absolute focus:z-50 rounded-br-2xl shadow-lg"
      >
        Saltar al contenido principal
      </a>

      {/* --- 1. HERO SECTION --- */}
      <header className="relative w-full pt-32 pb-24 lg:pt-44 lg:pb-32 flex flex-col items-center justify-center text-center px-4">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up">
          <span className="px-5 py-2 rounded-full bg-white backdrop-blur-md border border-blue-200 text-blue-700 text-sm font-bold mb-8 tracking-wide uppercase shadow-sm shadow-blue-700/10 hover:scale-105 hover:bg-blue-500 hover:text-white transition-all cursor-default">
            Bienvenidos a ADIEL
          </span>
          {/* CAMBIO: Títulos en blue-950 (azul casi negro) para máxima elegancia */}
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-blue-950 mb-6 leading-tight drop-shadow-sm">
            Uniendo liderazgo y <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-blue-400">
              propósito en cada evento
            </span>
          </h1>
          {/* CAMBIO: Párrafos en blue-900/80 (azul oscuro con opacidad) */}
          <p className="text-lg md:text-xl text-blue-900/80 max-w-2xl leading-relaxed mb-10 font-medium">
            Descubre congresos, seminarios y actividades diseñadas para
            potenciar tu ministerio. Regístrate en segundos y obtén tu
            acreditación digital.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link
              href="#eventos"
              className="px-8 py-4 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 hover:scale-105 transition-all shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50"
            >
              Explorar Eventos
            </Link>
            <Link
              href="#asociacion"
              className="px-8 py-4 rounded-full bg-white/70 backdrop-blur-xl text-blue-950 border border-blue-100 font-bold hover:bg-white hover:text-blue-700 hover:scale-105 transition-all shadow-sm hover:shadow-md"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </header>

      {/* --- 2. INFORMACIÓN DE LA ASOCIACIÓN --- */}
      <section id="asociacion" className="py-24 px-4 w-full relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/70 backdrop-blur-2xl border border-blue-50 shadow-2xl shadow-blue-900/10 transition-all hover:shadow-blue-700/20 hover:-translate-y-2 duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-100/0 via-blue-100/40 to-blue-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-6">
                ¿Qué es la Asociación ADIEL?
              </h2>
              <p className="text-lg text-blue-900/80 mb-8 leading-relaxed font-medium">
                Somos una red comprometida con el desarrollo integral del
                liderazgo. Nuestra misión es proveer herramientas, capacitación
                y espacios de conexión para que cada ministerio alcance su
                máximo potencial.
              </p>
              <ul className="space-y-5">
                {[
                  "Red de apoyo continuo",
                  "Capacitación teológica y práctica",
                  "Eventos de alto impacto",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-blue-950 font-semibold group/item"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 shadow-sm text-blue-700 flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-blue-700 group-hover/item:text-white transition-all duration-300">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative h-100 w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 border-4 border-white group">
            {/* CAMBIO: Gradiente de la imagen ahora es full azul */}
            <div className="absolute inset-0 bg-linear-to-t from-blue-950/90 via-blue-900/30 to-transparent z-10" />
            <div className="w-full h-full bg-blue-200 group-hover:scale-110 transition-transform duration-1000 ease-out" />
            <div className="absolute bottom-8 left-8 z-20 transform group-hover:translate-x-2 transition-transform duration-500">
              <span className="px-3 py-1 bg-blue-700/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-2 block w-max">
                Trayectoria
              </span>
              <p className="text-white font-extrabold text-2xl md:text-3xl leading-tight drop-shadow-md">
                Más de 20 años <br /> de excelencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. UNIDADES DE SERVICIO (CAMBIO RADICAL DE CONTRASTE) --- */}
      <section id="unidades" className="py-24 px-4 w-full relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Convertimos este header en una tarjeta de impacto azul fuerte */}
          <div className="text-center mb-16 bg-blue-700 p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-blue-700/20 inline-block w-full max-w-3xl mx-auto flex-col items-center transform hover:-translate-y-1 transition-transform">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-sm">
              Nuestras Unidades de Servicio
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
              Descubre los diferentes ministerios y grupos que conforman nuestra
              asociación, diseñados para servir, enseñar y conectar a cada
              miembro de la familia.
            </p>
          </div>

          <ServiceUnits units={serviceUnitsData} />
        </div>
      </section>

      {/* --- 4. MAPA DE IGLESIAS --- */}
      <section
        id="mapa"
        className="py-24 px-4 w-full bg-blue-100/50 backdrop-blur-xl border-y border-blue-50 shadow-inner"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4">
              Nuestra Red de Iglesias
            </h2>
            <p className="text-lg text-blue-900/80 max-w-2xl mx-auto font-medium">
              Encuentra una congregación cerca de ti. Estamos presentes en
              múltiples ciudades, unidos por un mismo propósito. Utiliza el
              buscador o explora el mapa.
            </p>
          </div>

          <ChurchLocator churches={churchesData} />
        </div>
      </section>

      {/* --- 5. EVENTOS IMPORTANTES --- */}
      <section id="eventos" className="py-24 px-4 w-full relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 bg-linear-to-r from-blue-50 to-white backdrop-blur-md p-6 md:p-8 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md hover:shadow-blue-900/5 transition-all">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-3">
                Próximos Eventos
              </h2>
              <p className="text-lg text-blue-900/80 max-w-xl font-medium">
                No te pierdas nuestras próximas reuniones, congresos y
                seminarios. Reserva tu lugar hoy mismo.
              </p>
            </div>
            {/* <Link
              href="/eventos"
              className="px-6 py-3 rounded-xl bg-white text-blue-700 border border-blue-200 font-bold hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all shadow-sm hover:shadow-blue-700/20 whitespace-nowrap flex items-center gap-2 group"
            >
              Ver todos los eventos
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link> */}
          </div>

          <RecentEvents events={eventsData} />
        </div>
      </section>

      {/* --- 6. ÚLTIMAS NOTICIAS / POSTS --- */}
      <section
        id="noticias"
        className="py-24 px-4 w-full relative z-10 bg-blue-50/80 backdrop-blur-2xl border-t border-blue-100 shadow-[0_-10px_40px_-15px_rgba(29,78,216,0.1)]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4 flex items-center gap-3">
                Últimas Noticias
              </h2>
              <p className="text-lg text-blue-900/80 max-w-xl font-medium">
                Mantente informado sobre campañas, devocionales y anuncios
                importantes de nuestras instituciones y unidades de servicio.
              </p>
            </div>

            {/* Botón oscuro cambiado a blue-950 para mantener la gama */}
            {/* <Link
              href="/noticias"
              className="px-6 py-3 rounded-full bg-blue-950 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-md hover:shadow-blue-700/30 whitespace-nowrap"
            >
              Ver todas las noticias
            </Link> */}
          </div>

          <RecentPosts posts={postsData} />
        </div>
      </section>
    </div>
  );
}

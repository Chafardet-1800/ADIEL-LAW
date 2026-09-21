import ChurchLocator from "@/components/ChurchLocator";
import RecentPosts from "@/components/RecentPosts";
import ServiceUnits from "@/components/ServiceUnits";
import Link from "next/link";

export default function HomePage() {
  // 1. OBTENCIÓN DE DATOS (Se ejecuta en el servidor)
  // Aquí harías tu fetch real: const res = await fetch('...'); const iglesias = await res.json();
  const iglesiasData = [
    {
      id: "6a285322706bc80045db1aff",
      name: "Iglesia Bautista Central",
      address: "Av. Principal con Calle 2, Caracas, Miranda",
    },
    {
      id: "6a285322706bc80045db1b00",
      name: "Ministerio Luz y Vida",
      address: "Calle Los Robles, Valencia, Carabobo",
    },
    {
      id: "6a285322706bc80045db1b01",
      name: "Comunidad Cristiana Renuevo",
      address: "Av. Las Américas, Mérida",
    },
  ];

  const unidadesData = [
    {
      location: null,
      metadata: {
        created_at: "2026-06-09T17:52:57.766Z",
        is_deleted: false,
        updated_at: "2026-06-09T17:52:57.766Z",
      },
      social_links: {
        facebook: "https://facebook.com/comedorsolidario",
        instagram: "https://instagram.com/comedorsolidario",
        tiktok: null,
        x: null,
      },
      id: "6a2852f9706bc80045db1afe",
      name: "Fundación Comedor Solidario",
      address: null,
      building_images: [],
      entity_type: "SERVICE_UNIT",
      history: "Fundado en 2020 durante la crisis global...",
      logo_url: "https://midominio.com/logo-comedor.png",
      members_images: ["https://midominio.com/equipo1.jpg"],
      mission: "Proveer alimentación a personas vulnerables.",
      slogan: "Alimentando esperanzas",
      url_maps: null,
      vision: "Un país con cero hambre para el 2030.",
      event_ids: [
        "6a298e5acdf637e52625e018",
        "6a298f13cdf637e52625e019",
        "6a298f1ecdf637e52625e01a",
        "6a298f8825112040d0bd6fca",
        "6a31a3c09c75c23e779070fc",
      ],
    },
  ];

  const postsData = [
    {
      id: "6a285d7d16cabc199b3158b7",
      title: "Gran evento de recolección 2026",
      slug: "gran-evento-de-recolecci-n-2026",
      content:
        "Estaremos recibiendo donativos este fin de semana en nuestra sede central. ¡Tu aporte hace la diferencia! Trae alimentos no perecederos y ropa en buen estado.",
      images: [], // Prueba del fallback
      tags: ["donacion", "comunidad", "evento"],
      published_at: "2026-06-09T18:37:49.119Z",
    },
    {
      id: "6a285d7d16cabc199b3158b8",
      title: "Nuevo ciclo de estudios bíblicos para jóvenes",
      slug: "nuevo-ciclo-de-estudios-biblicos-jovenes",
      content:
        "Iniciamos un nuevo recorrido por el libro de Juan. Abierto para jóvenes de 15 a 25 años. Inscríbete en nuestra plataforma.",
      images: ["https://midominio.com/imagen-jovenes.jpg"],
      tags: ["estudio", "jovenes"],
      published_at: "2026-06-12T10:00:00.000Z",
    },
    {
      id: "6a285d7d16cabc199b3158b9",
      title: "Jornada médica gratuita en la comunidad",
      slug: "jornada-medica-gratuita-comunidad",
      content:
        "Nuestros médicos voluntarios estarán atendiendo consultas generales, pediatría y odontología básica este sábado desde las 8:00 AM.",
      images: [],
      tags: ["salud", "servicio"],
      published_at: "2026-06-15T09:15:00.000Z",
    },
  ];

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
          <ServiceUnits units={unidadesData} />
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
          <ChurchLocator churches={iglesiasData} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tarjeta de Evento 1 */}
            <article className="group relative bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-2 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="w-full h-48 bg-zinc-200 rounded-xl overflow-hidden relative">
                {/* Imagen del evento iría aquí */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0000fe]">
                  15 Octubre
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-[#0000fe] transition-colors">
                  Congreso de Liderazgo 2024
                </h3>
                <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                  Tres días de capacitación intensiva con oradores
                  internacionales para equipar tu ministerio.
                </p>
                <Link
                  href="/eventos/congreso-2024"
                  className="inline-block w-full text-center py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold group-hover:bg-[#0000fe] group-hover:text-white transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            </article>
          </div>
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

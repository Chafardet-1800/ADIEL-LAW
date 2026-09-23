import type { Metadata, Viewport } from "next";
// Optimización de fuentes nativa: Cero descargas externas, cero CLS (Layout Shift)
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// 📱 Configuración estricta del Viewport para accesibilidad móvil
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Importante para Accesibilidad: Nunca bloquees el zoom (user-scalable=no)
  themeColor: "#0000fe",
};

// 🔍 EL SANTO GRIAL DEL SEO
export const metadata: Metadata = {
  metadataBase: new URL("https://tudominio.com"), // 👈 CAMBIA ESTO
  title: {
    default: "ADIEL | Liderazgo y Eventos", // Título por defecto
    template: "%s | ADIEL", // Plantilla mágica: Si en otra página pones "Congreso", dirá "Congreso | ADIEL"
  },
  description:
    "Plataforma integral para la gestión, registro y logística de los mejores eventos de liderazgo y congregación.",
  keywords: [
    "eventos",
    "liderazgo",
    "congresos",
    "registro de eventos",
    "ADIEL",
  ],
  authors: [{ name: "ADIEL Team" }],
  creator: "ADIEL",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://tudominio.com",
    title: "ADIEL | Liderazgo y Eventos",
    description: "Plataforma integral para la gestión y registro de eventos.",
    siteName: "ADIEL",
    images: [
      {
        url: "/og-image.jpg", // Debes colocar una imagen en la carpeta public/
        width: 1200,
        height: 630,
        alt: "Banner Oficial de ADIEL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADIEL | Liderazgo y Eventos",
    description: "Gestión, registro y logística de eventos.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Es CRÍTICO declarar el lang="es" para SEO y lectores de pantalla (Accesibilidad)
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.className} bg-white text-zinc-900 antialiased selection:bg-blue-700 selection:text-white`}
      >
        {/* Aquí luego inyectaremos el <Navbar /> semántico */}
        <main id="main-content" className="flex flex-col min-h-screen">
          {children}
        </main>
        {/* Aquí luego inyectaremos el <Footer /> semántico */}
      </body>
    </html>
  );
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"], // Protege tus rutas privadas de Google
    },
    sitemap: "https://tudominio.com/sitemap.xml", // 👈 CAMBIA ESTO
  };
}

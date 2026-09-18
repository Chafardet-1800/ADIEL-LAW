import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Aquí en el futuro harás un fetch a tus "eventos públicos" para listarlos en Google

  return [
    {
      url: "https://tudominio.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://tudominio.com/eventos",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://tudominio.com/nosotros",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

import { MetadataRoute } from "next";

// Función para limpiar strings (convertir "Iglesia Bautista!" a "iglesia-bautista")
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Reemplaza espacios con -
    .replace(/[^\w\-]+/g, "") // Elimina caracteres especiales
    .replace(/\-\-+/g, "-") // Reemplaza múltiples - por uno solo
    .replace(/^-+/, "") // Quita - al inicio
    .replace(/-+$/, ""); // Quita - al final
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tudominio.com";

  // 1. Añades tus rutas estáticas
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/eventos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  // 2. Haces fetch a TODAS las iglesias de tu backend (necesitas un endpoint que devuelva el listado)
  // const res = await fetch('https://tuapi.com/iglesias');
  // const iglesias = await res.json();
  const iglesias = [
    { id: "6a285322706bc80045db1aff", name: "Iglesia Bautista Central" },
  ]; // Ejemplo

  // 3. Generas las rutas dinámicas para el sitemap
  const dynamicChurchRoutes = iglesias.map((iglesia) => {
    const safeName = slugify(iglesia.name);
    return {
      url: `${baseUrl}/iglesias/${safeName}-${iglesia.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...dynamicChurchRoutes];
}

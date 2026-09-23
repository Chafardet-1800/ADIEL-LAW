import { getEventoById, getIdFromSlug } from "@/src/services/publicData";
import RegistrationFormClient from "./RegistrationFormClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);
  const event = await getEventoById(id);

  return {
    title: `Registro: ${event?.name || "Evento"} | Red ADIEL`,
  };
}

export default async function EventRegistrationPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = getIdFromSlug(resolvedParams.slug);

  // Usamos el servicio centralizado (con caché en el servidor)
  const event = await getEventoById(id);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50/50">
        <h1 className="text-2xl font-bold text-blue-950">
          Evento no encontrado
        </h1>
      </div>
    );
  }

  // Pasamos el evento a nuestro componente de cliente interactivo
  return <RegistrationFormClient event={event} />;
}

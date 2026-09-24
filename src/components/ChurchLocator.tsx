"use client";

import { useState } from "react";
import Link from "next/link";
import { Institution } from "@/src/services/publicData";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function ChurchLocator({
  churches,
}: {
  churches: Institution[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  // 1. Guardamos la intención del usuario, no el resultado final
  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);

  // 2. Filtrado reactivo
  const filteredChurches = churches.filter(
    (church) =>
      church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (church.address ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 3. ¡EL TRUCO DE ESTADO DERIVADO! (Adiós useEffect)
  // Comprobamos si la iglesia que el usuario clicó sigue en los resultados
  const isSelectedInResults = filteredChurches.some(
    (c) => c.id === userSelectedId,
  );

  // Calculamos la iglesia activa al vuelo:
  // Es la que el usuario eligió (si sigue visible), o la primera de la lista.
  const activeChurchId = isSelectedInResults
    ? userSelectedId
    : filteredChurches.length > 0
      ? filteredChurches[0].id
      : null;

  // 4. Obtenemos las coordenadas
  const activeChurch = churches.find((c) => c.id === activeChurchId);
  const activeCoords = activeChurch?.location?.coordinates;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <div className="w-full h-150 flex flex-col lg:flex-row rounded-[2.5rem] overflow-hidden border border-white shadow-2xl shadow-blue-900/10 bg-white/60 backdrop-blur-2xl">
      {/* PANEL IZQUIERDO */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white/80 border-b lg:border-b-0 lg:border-r border-blue-50 z-10">
        {/* Buscador Fijo */}
        <div className="p-5 border-b border-blue-100 bg-white/40 backdrop-blur-md sticky top-0">
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-blue-700 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar ciudad o nombre..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all text-blue-950 font-medium placeholder:text-zinc-400 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista Scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredChurches.length > 0 ? (
            filteredChurches.map((church) => {
              const churchUrl = `/iglesias/${slugify(church.name)}-${church.id}`;
              const isActive = activeChurchId === church.id;

              return (
                <div
                  key={church.id}
                  onClick={() => setUserSelectedId(church.id)} // 👈 Actualizamos la intención del usuario
                  className={`group flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? "bg-blue-700 border-blue-700 shadow-lg shadow-blue-700/20"
                      : "bg-blue-50/50 border-blue-100 hover:bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <h3
                    className={`font-extrabold text-lg transition-colors ${isActive ? "text-white" : "text-blue-950 group-hover:text-blue-700"}`}
                  >
                    {church.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 line-clamp-2 font-medium ${isActive ? "text-blue-100" : "text-zinc-600"}`}
                  >
                    📍 {church.address}
                  </p>

                  <div
                    className={`mt-4 pt-3 border-t flex justify-between items-center ${isActive ? "border-blue-600/50" : "border-blue-100"}`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-blue-200" : "text-zinc-400"}`}
                    >
                      {isActive ? "Viendo en mapa" : "Click para ver"}
                    </span>
                    <Link
                      href={churchUrl}
                      className={`text-sm font-bold flex items-center gap-1 transition-all ${
                        isActive
                          ? "text-white hover:text-blue-200"
                          : "text-blue-700 hover:text-blue-800 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      Ver perfil →
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-8 text-blue-900/60 font-medium bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
              No encontramos iglesias con ese término.
            </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: El Mapa Interactivo */}
      <div className="w-full h-64 lg:h-full lg:w-2/3 bg-blue-50 relative">
        {activeCoords && apiKey ? (
          <iframe
            key={activeChurchId}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${activeCoords[1]},${activeCoords[0]}&zoom=15`}
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col text-blue-900/40 p-8 text-center bg-blue-50/50 backdrop-blur-sm">
            <span className="text-5xl mb-4">🌍</span>
            <p className="font-extrabold text-xl text-blue-950 mb-2">
              Mapa no disponible
            </p>
            <p className="text-sm font-medium max-w-sm">
              {!apiKey
                ? "Falta configurar la API Key de Google Maps en las variables de entorno."
                : "La iglesia seleccionada no tiene coordenadas registradas en el sistema."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

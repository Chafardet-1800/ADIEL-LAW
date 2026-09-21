"use client";

import { useState } from "react";
import Link from "next/link";
import { Institution } from "@/services/publicData";

// Función utilitaria para generar el slug que hablamos (Punto 3)
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

  // Filtrado reactivo en el cliente
  const filteredChurches = churches.filter(
    (church) =>
      church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (church.address ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    // Contenedor principal: Altura fija (600px) para no dañar el scroll de la página principal
    <div className="w-full h-[600px] flex flex-col lg:flex-row rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-white/40 backdrop-blur-md">
      {/* PANEL IZQUIERDO: Buscador y Lista (1/3 del ancho en desktop) */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white/60 border-b lg:border-b-0 lg:border-r border-white/50 z-10">
        {/* Buscador Fijo */}
        <div className="p-4 border-b border-zinc-200/50 bg-white/40 backdrop-blur-sm sticky top-0">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#0000fe] transition-shadow text-zinc-900 placeholder:text-zinc-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista Scrolleable (El paraíso del SEO Interno) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredChurches.length > 0 ? (
            filteredChurches.map((church) => {
              // Construimos la URL Híbrida: slug + id
              const churchUrl = `/iglesias/${slugify(church.name)}-${church.id}`;

              return (
                <Link
                  href={churchUrl}
                  key={church.id}
                  className="group flex flex-col p-4 rounded-2xl bg-white/50 border border-transparent hover:border-[#0000fe]/30 hover:bg-white transition-all hover:shadow-md"
                >
                  <h3 className="font-bold text-zinc-900 group-hover:text-[#0000fe] transition-colors">
                    {church.name}
                  </h3>
                  <p className="text-sm text-zinc-600 mt-1 line-clamp-2">
                    📍 {church.address}
                  </p>
                  <span className="text-xs font-semibold text-[#0000fe] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver detalles →
                  </span>
                </Link>
              );
            })
          ) : (
            <div className="text-center p-6 text-zinc-500">
              No encontramos iglesias con ese término.
            </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: El Mapa (2/3 del ancho en desktop) */}
      <div className="w-full h-64 lg:h-full lg:w-2/3 bg-zinc-100 relative">
        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 flex-col">
          <svg
            className="w-12 h-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="font-medium">Mapa interactivo con pines de iglesias</p>
          <p className="text-sm mt-2 text-zinc-500">
            (Aquí inyectaremos tu iframe o Mapbox)
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";

// Tipamos el schedule según tu backend
interface ScheduleItem {
  active_name: string;
  start_time: string;
  end_time: string;
}

export default function EventSchedule({
  schedule,
}: {
  schedule: ScheduleItem[];
}) {
  // 1. ESTADO PARA EVITAR EL HYDRATION ERROR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Defer setting mounted to the next tick to avoid synchronous state update
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Agrupamos las actividades por día
  const groupedSchedule = useMemo(() => {
    const groups: Record<string, ScheduleItem[]> = {};

    schedule.forEach((item) => {
      // Extraemos la fecha en formato corto (Ej: "23 jun. 2026")
      const dateObj = new Date(item.start_time);
      const dateKey = dateObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });

    return groups;
  }, [schedule]);

  const availableDays = Object.keys(groupedSchedule);
  const [selectedDay, setSelectedDay] = useState(availableDays[0]);

  // 2. RETORNO DE SEGURIDAD PARA EL SERVIDOR (Skeleton)
  // Mientras el servidor renderiza, mostramos un "Skeleton" o estado de carga
  // Esto evita el error de hidratación garantizando que servidor y cliente coincidan
  if (!isMounted) {
    return (
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-blue-50 mb-12">
        <div className="animate-pulse">
          <div className="h-8 bg-blue-100 rounded w-1/3 mb-8"></div>
          <div className="flex gap-3 mb-8">
            <div className="h-10 w-24 bg-blue-50 rounded-xl"></div>
            <div className="h-10 w-24 bg-blue-50 rounded-xl"></div>
          </div>
          <div className="space-y-4">
            <div className="h-16 bg-blue-50/50 rounded-2xl w-full"></div>
            <div className="h-16 bg-blue-50/50 rounded-2xl w-full"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!schedule || schedule.length === 0) return null;

  return (
    <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-blue-50 mb-12 hover:shadow-lg hover:shadow-blue-900/5 transition-shadow duration-300">
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-6 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 text-xl">
          🕒
        </span>
        Cronograma de Actividades
      </h2>

      {/* Pestañas de Días */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-blue-100 pb-4">
        {availableDays.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              selectedDay === day
                ? "bg-blue-700 text-white shadow-md shadow-blue-700/20 scale-105"
                : "bg-blue-50 text-blue-900 hover:bg-blue-100"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Lista de Actividades del Día Seleccionado */}
      <div className="space-y-3">
        {groupedSchedule[selectedDay]?.map((item, index) => {
          const start = new Date(item.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const end = new Date(item.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-blue-50/30 border border-transparent hover:border-blue-100 hover:bg-blue-50/80 transition-colors group"
            >
              <div className="shrink-0 text-blue-700 font-extrabold text-sm bg-white py-2 px-4 rounded-xl shadow-sm border border-blue-100 text-center group-hover:scale-105 transition-transform">
                {start} - {end}
              </div>
              <div>
                <h4 className="font-bold text-blue-950 text-lg">
                  {item.active_name}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

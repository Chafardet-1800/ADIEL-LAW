"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RefreshTicketButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresco silencioso cada 3 minutos (180,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 180000);
    return () => clearInterval(interval);
  }, [router]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    router.refresh(); // Le dice a Next.js que vuelva a ejecutar el Server Component

    // Devolvemos el estado del botón a la normalidad después de 1 segundo (Feedback visual)
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleManualRefresh}
      disabled={isRefreshing}
      title="Actualizar estado del ticket"
      className="ml-3 w-8 h-8 rounded-full bg-blue-800/50 hover:bg-blue-700 flex items-center justify-center text-blue-200 hover:text-white transition-all border border-blue-700/50 disabled:opacity-50"
    >
      <svg
        className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
}

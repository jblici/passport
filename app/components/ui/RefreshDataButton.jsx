"use client";
import { useEffect, useState } from "react";
import { CACHE_PREFIX } from "@/app/lib/utils/csvParser";

const getOldestCacheTimestamp = () => {
  try {
    let oldest = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(CACHE_PREFIX)) continue;
      const { ts } = JSON.parse(localStorage.getItem(key));
      if (oldest === null || ts < oldest) oldest = ts;
    }
    return oldest;
  } catch {
    return null;
  }
};

const formatTimestamp = (ts) => {
  if (!ts) return null;
  return new Date(ts).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
};

const clearCache = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_PREFIX)) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
};

const RefreshDataButton = () => {
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    setTimestamp(getOldestCacheTimestamp());
  }, []);

  const handleRefresh = () => {
    clearCache();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={handleRefresh}
        className="px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out flex items-center gap-2 whitespace-nowrap bg-blue-400 text-white hover:bg-blue-300 hover:shadow-md"
        title="Limpiar caché y recargar datos desde Google Sheets"
      >
        <span className="text-base">🔄</span>
        Actualizar datos
      </button>
      {timestamp && (
        <span className="text-xs text-blue-100">
          {formatTimestamp(timestamp)}
        </span>
      )}
    </div>
  );
};

export default RefreshDataButton;

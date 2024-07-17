"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, [activePath]);

  return (
    <aside className="bg-blue-500 text-primary-foreground w-64 p-6 flex flex-col text-white">
      <div className="flex items-center gap-4 mb-8">
        <p className="text-xl font-bold">Travel Admin</p>
      </div>
      <nav className="flex flex-col gap-4">
        <Link
          href="/centros"
          className={`hover:text-muted-foreground ${
            activePath === "/centros" ? "text-bold underline" : null
          }`}
          prefetch={false}
        >
          Centros
        </Link>
        <Link
          href="/hoteles"
          className={`hover:text-muted-foreground ${activePath === "/hoteles" ? "font-bold underline" : null}`}
          prefetch={false}
        >
          Hoteles
        </Link>
        <Link
          href="/habitaciones"
          className={`hover:text-muted-foreground ${activePath === "/habitaciones" ? "font-bold underline" : null}`}
          prefetch={false}
        >
          Habitaciones
        </Link>
        <Link
          href="/servicios"
          className={`hover:text-muted-foreground ${activePath === "/servicios" ? "font-bold underline" : null}`}
          prefetch={false}
        >
          Servicios
        </Link>
        <Link
          href="/pases"
          className={`hover:text-muted-foreground ${activePath === "/pases" ? "font-bold underline" : null}`}
          prefetch={false}
        >
          Pases de ski
        </Link>
        <Link
          href="/transporte"
          className={`hover:text-muted-foreground ${activePath === "/transporte" ? "font-bold underline" : null}`}
          prefetch={false}
        >
          Transporte
        </Link>
      </nav>
    </aside>
  );
};

export default Navbar;

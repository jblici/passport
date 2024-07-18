"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon } from "../svg/svg";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, [activePath]);

  return (
    <div className="flex flex-col sm:h-screen">
      <header className="bg-blue-500 text-primary-foreground p-6 px-8 flex items-center justify-between sm:hidden">
        <div className="flex flex-col">
          <Link
            href="/panel"
            className={`text-2xl font-bold py-2 ${
              activePath.includes("/panel") ? "font-bold bg-blue-600 rounded" : null
            }`}
            prefetch={false}
          >
            Panel Administrativo
          </Link>
          <Link
            href="/cotizador"
            className={`text-2xl font-bold py-2 ${
              activePath.includes("/cotizador") ? "font-bold underline" : null
            }`}
            prefetch={false}
          >
            Cotizador
          </Link>
        </div>
        <div></div>
        {activePath.includes("/panel") ? (
          <Sheet>
            <SheetTrigger asChild>
              <MenuIcon className="w-6 h-6 text-white" />
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8 p-2">
                <Link
                  href="/panel/centros"
                  className={`hover:text-muted-foreground ${
                    activePath === "/centros" ? "font-bold underline" : null
                  }`}
                  prefetch={false}
                >
                  Centros
                </Link>
                <Link
                  href="/panel/hoteles"
                  className={`hover:text-muted-foreground ${
                    activePath === "/hoteles" ? "font-bold underline" : null
                  }`}
                  prefetch={false}
                >
                  Hoteles
                </Link>
                <Link
                  href="/panel/habitaciones"
                  className={`hover:text-muted-foreground ${
                    activePath === "/habitaciones" ? "font-bold underline" : null
                  }`}
                  prefetch={false}
                >
                  Habitaciones
                </Link>
                <Link
                  href="/panel/servicios"
                  className={`hover:text-muted-foreground ${
                    activePath === "/servicios" ? "font-bold underline" : null
                  }`}
                  prefetch={false}
                >
                  Servicios
                </Link>
                <Link
                  href="/panel/pases"
                  className={`hover:text-muted-foreground ${
                    activePath === "/pases" ? "font-bold underline" : null
                  }`}
                  prefetch={false}
                >
                  Pases de ski
                </Link>
                <Link
                  href="/panel/transporte"
                  className={`hover:text-muted-foreground ${
                    activePath === "/transporte" ? "font-bold underline" : null
                  }`}
                  prefetch={false}
                >
                  Transporte
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        ) : null}
      </header>
      <div className="flex flex-1 h-10">
        <aside className="bg-blue-500 text-primary-foreground p-6 flex-col hidden sm:flex">
          <div className="flex flex-col">
            <Link
              href="/panel"
              className={`text-2xl font-bold p-2 hover:bg-blue-600 hover:rounded-xl hover:text-black ${
                activePath.includes("/panel") ? "font-bold bg-blue-600 rounded-xl" : null
              }`}
              prefetch={false}
            >
              Panel Administrativo
            </Link>
            <Link
              href="/cotizador"
              className={`text-2xl font-bold p-2 hover:bg-blue-600 hover:rounded-xl hover:text-black ${
                activePath.includes("/cotizador") ? "font-bold bg-blue-600 rounded-xl" : null
              }`}
              prefetch={false}
            >
              Cotizador
            </Link>
          </div>
          {activePath.includes("/panel") ? (
            <nav className="flex-1 flex flex-col gap-4 mt-8 p-2">
              <Link
                href="/panel/centros"
                className={`hover:text-muted-foreground ${
                  activePath === "/centros" ? "font-bold underline" : null
                }`}
                prefetch={false}
              >
                Centros
              </Link>
              <Link
                href="/panel/hoteles"
                className={`hover:text-muted-foreground ${
                  activePath === "/hoteles" ? "font-bold underline" : null
                }`}
                prefetch={false}
              >
                Hoteles
              </Link>
              <Link
                href="/panel/habitaciones"
                className={`hover:text-muted-foreground ${
                  activePath === "/habitaciones" ? "font-bold underline" : null
                }`}
                prefetch={false}
              >
                Habitaciones
              </Link>
              <Link
                href="/panel/servicios"
                className={`hover:text-muted-foreground ${
                  activePath === "/servicios" ? "font-bold underline" : null
                }`}
                prefetch={false}
              >
                Servicios
              </Link>
              <Link
                href="/panel/pases"
                className={`hover:text-muted-foreground ${
                  activePath === "/pases" ? "font-bold underline" : null
                }`}
                prefetch={false}
              >
                Pases de ski
              </Link>
              <Link
                href="/panel/transporte"
                className={`hover:text-muted-foreground ${
                  activePath === "/transporte" ? "font-bold underline" : null
                }`}
                prefetch={false}
              >
                Transporte
              </Link>
            </nav>
          ) : null}
        </aside>
      </div>
    </div>
  );
};
{
  /*<div>
      <aside className="bg-blue-500 h-full text-primary-foreground w-64 p-6 flex flex-col text-white sm:hidden">
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
            className={`hover:text-muted-foreground ${
              activePath === "/hoteles" ? "font-bold underline" : null
            }`}
            prefetch={false}
          >
            Hoteles
          </Link>
          <Link
            href="/habitaciones"
            className={`hover:text-muted-foreground ${
              activePath === "/habitaciones" ? "font-bold underline" : null
            }`}
            prefetch={false}
          >
            Habitaciones
          </Link>
          <Link
            href="/servicios"
            className={`hover:text-muted-foreground ${
              activePath === "/servicios" ? "font-bold underline" : null
            }`}
            prefetch={false}
          >
            Servicios
          </Link>
          <Link
            href="/pases"
            className={`hover:text-muted-foreground ${
              activePath === "/pases" ? "font-bold underline" : null
            }`}
            prefetch={false}
          >
            Pases de ski
          </Link>
          <Link
            href="/transporte"
            className={`hover:text-muted-foreground ${
              activePath === "/transporte" ? "font-bold underline" : null
            }`}
            prefetch={false}
          >
            Transporte
          </Link>
        </nav>
      </aside>
      <aside className="bg-blue-500 text-primary-foreground p-6 hidden sm:flex">
          <Link href="#" className="text-xl font-bold" prefetch={false}>
            Travel Admin
          </Link>
          <nav className="flex-1 flex flex-col gap-4 mt-8">
            <Link href="#" className="hover:text-primary" prefetch={false}>
              Hotels
            </Link>
            <Link href="#" className="hover:text-primary" prefetch={false}>
              Rooms
            </Link>
            <Link href="#" className="hover:text-primary" prefetch={false}>
              Services
            </Link>
            <Link href="#" className="hover:text-primary" prefetch={false}>
              Ski Passes
            </Link>
            <Link href="#" className="hover:text-primary" prefetch={false}>
              Transport
            </Link>
          </nav>
        </aside>
    </div> */
}

export default Navbar;

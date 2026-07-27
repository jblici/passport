"use client";
import Link from "next/link";
import React from "react";
import SearchFilters from "../SearchFilters";
import RefreshDataButton from "./RefreshDataButton";

const Navbar = () => {
  return (
    <div className="flex flex-col w-screen text-xl">
      <header className="bg-blue-500 text-primary-foreground px-8 py-3 flex flex-col gap-2">
        {/* Fila 1: logo (solo desktop) + categorías + refresh (solo desktop) */}
        <div className="relative flex items-center justify-center">
          <Link href="/" className="text-2xl font-bold absolute left-0 hidden sm:block" prefetch={false}>
            Passport
          </Link>
          <SearchFilters />
          <div className="absolute right-0 hidden sm:block">
            <RefreshDataButton />
          </div>
        </div>

        {/* Fila 2: refresh (solo mobile) */}
        <div className="flex justify-center sm:hidden">
          <RefreshDataButton />
        </div>
      </header>
    </div>
  );
};

export default Navbar;

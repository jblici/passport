"use client";
import Link from "next/link";
import React from "react";
import SearchFilters from "../SearchFilters";

const Navbar = () => {
  return (
    <div className="flex flex-col w-screen text-xl">
      <header className="bg-blue-500 text-primary-foreground p-4 px-8 relative flex items-center justify-center">
        <Link href="/" className="text-2xl font-bold absolute left-8" prefetch={false}>
          Passport
        </Link>
        <SearchFilters />
      </header>
    </div>
  );
};

export default Navbar;

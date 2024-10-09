"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, [activePath]);

  return (
    <div className="flex flex-col w-screen text-xl">
      <header className="bg-blue-500 text-primary-foreground p-6 px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <Link
            href="/"
            className="text-2xl font-bold py-2"
            prefetch={false}
          >
            Passport
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Navbar;

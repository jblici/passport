"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/ui/navbar";

const Home = () => {
  //const router = useRouter();

  {
    /* useEffect(() => {
    const isAuthenticated = false; // Cambia esto con la lógica de autenticación real

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]); */
  }

  return (
    <div className="flex flex-col sm:flex-row text-lg">
      <Navbar />
    </div>
  );
};

export default Home;

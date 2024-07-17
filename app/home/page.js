"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Panel } from "@/components/panel";

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
    <main>
      <Panel />
    </main>
  );
};

export default Home;

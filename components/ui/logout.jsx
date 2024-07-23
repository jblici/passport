import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React from "react";

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="w-full p-2 bg-red-600 text-white rounded mt-4">
      Logout
    </button>
  );
};

export default Logout;

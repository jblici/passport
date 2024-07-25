import { logout } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Signout } from "../svg/svg";

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="w-fit p-2 bg-red-600 text-white rounded-full mt-4">
      <Signout />
    </button>
  );
};

export default Logout;

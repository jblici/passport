'use client'
import { useState } from "react";
//import { useRouter } from "next/router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const router = useRouter();

  {/*const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí se realiza la petición al backend
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Maneja el registro exitoso, por ejemplo, redirige a la página de inicio de sesión
      router.push("/login");
    } else {
      // Maneja errores
      alert("Registration failed");
    }
  };*/}

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="w-1/3 bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

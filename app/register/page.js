'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/app/lib/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      router.push("/panel");
    } catch (error) {
      setError('Registro sin exito. Revise su mail y contraseña.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-1/3 bg-white p-8 rounded shadow-md">
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
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
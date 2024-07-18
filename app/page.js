import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Link href="/panel" className="flex justify-center">
        <button className="bg-blue-500 text-white font-bold p-6 rounded-full text-6xl">
          Entrar
        </button>
      </Link>
    </div>
  );
}

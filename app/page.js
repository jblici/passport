import Link from "next/link";

export default async function Home() {

  const csv = await fetch ('https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?output=csv')
              .then((res)=> res.text()); 
  const paquetes = csv 
    .split("\n")
    .slice(1)
    .map((row)=>{
      const [Provincia,	Cerro,	Hotel,	Habitacion,	personas,	precio,	Fecha_Inicio,	Fecha_Final,	Desayuno,	Menor,	Min_Noches,	Currency,	Tarifa,	Fecha_Vigencia,	Week] = row.split(",");
      return {Provincia,	Cerro,	Hotel,	Habitacion, personas: Number(personas), precio: Number(precio), Fecha_Inicio, Fecha_Final: Date(Fecha_Final), Desayuno, Min_Noches: Number(Min_Noches), Currency, Tarifa, Fecha_Vigencia, Week }
    })

    const csv2 = await fetch ('https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?output=csv')
              .then((res)=> res.text()); 
  const rentals = csv 
    .split("\n")
    .slice(1)
    .map((row)=>{
      const [Provincia,	Cerro,] = row.split(",");
      return {Provincia,	Cerro}
    })
    
    console.log(paquetes);
    console.log(rentals);

  
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

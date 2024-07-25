'use client'
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "./auth";

const useFetch = () => {
  const [paquetes, setPaquetes] = useState();
  const [centros, setCentros] = useState();
  const [hoteles, setHoteles] = useState();
  const [habitaciones, setHabitaciones] = useState();
  const [loading, setLoading] = useState(false);

  const obtenerDatos = useCallback(async () => {
    setLoading(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL;
      const token = getToken()
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const paquetesApi = await axios.get(`${baseURL}packages`, config);
      const centrosApi = await axios.get(`${baseURL}province`, config);
      const hotelsApi = await axios.get(`${baseURL}hotels`, config);
      const roomsApi = await axios.get(`${baseURL}rooms`, config);

      setPaquetes(paquetesApi.data);
      setCentros(centrosApi.data);
      setHoteles(hotelsApi.data);
      setHabitaciones(roomsApi.data);

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    obtenerDatos();
  }, [obtenerDatos]);

  return {
    paquetes,
    centros,
    hoteles,
    habitaciones,
    loading,
  };
};

export default useFetch;

import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email, password) => {
  const config = {
    maxBodyLength: Infinity,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    body: {email, password}
  };

  const response = await axios.post(`${API_URL}auth/login`, config);
  if (response.data.token) {
    Cookies.set("token", response.data.token, { expires: 7 }); // Almacena el token en una cookie por 7 días
  }
  return response.data;
};

export const register = async (email, password) => {
  const config = {
    maxBodyLength: Infinity,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    body: {email, password}
  };

  const response = await axios.post(`${API_URL}auth/register`, config);
  if (response.data.token) {
    Cookies.set("token", response.data.token, { expires: 7 });
  }
  return response.data;
};

export const logout = () => {
  Cookies.remove("token"); // Elimina el token de las cookies
};

export const getToken = () => {
  return Cookies.get("token");
};

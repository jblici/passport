/**
 * Centralized configuration for all Google Sheets data sources
 * This file consolidates all hardcoded URLs and centro configurations
 */

export const CENTROS = {
  LAS_LEÑAS: "Las Leñas",
  CERRO_CASTOR: "Cerro Castor",
  CATEDRAL: "Catedral",
  CHAPELCO: "Chapelco",
  CAVIAHUE: "Caviahue",
};

export const CENTRO_LIST = [
  CENTROS.LAS_LEÑAS,
  CENTROS.CERRO_CASTOR,
  CENTROS.CATEDRAL,
  CENTROS.CHAPELCO,
  CENTROS.CAVIAHUE,
];

/**
 * Configuration for accommodations (paquetes)
 * Each centro has paquetesUrl (rooms) and reglasUrl (rules)
 */
export const PAQUETES_CONFIG = {
  [CENTROS.LAS_LEÑAS]: {
    nombre: CENTROS.LAS_LEÑAS,
    paquetesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-gGbA9MsMsA-hsqYrvM8-icwqvPPQjMmvpAg3ArQmxQLwZShRw24K0uw5Y4Ot5cMItedJm-txLNfU/pub?gid=0&output=csv",
    reglasUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1338090560&output=csv",
  },
  [CENTROS.CERRO_CASTOR]: {
    nombre: CENTROS.CERRO_CASTOR,
    paquetesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=0&output=csv",
    reglasUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=395989538&output=csv",
  },
  [CENTROS.CATEDRAL]: {
    nombre: CENTROS.CATEDRAL,
    paquetesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=0&output=csv",
    reglasUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=395989538&output=csv",
  },
  [CENTROS.CHAPELCO]: {
    nombre: CENTROS.CHAPELCO,
    paquetesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=0&output=csv",
    reglasUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=395989538&output=csv",
  },
  [CENTROS.CAVIAHUE]: {
    nombre: CENTROS.CAVIAHUE,
    paquetesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=0&output=csv",
    reglasUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=1466940355&output=csv",
  },
};

/**
 * Configuration for other services (lift passes, classes, equipment rentals, transfers)
 */
export const SPREADSHEET_URLS = {
  pases: [
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=371646853&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1775784558&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1775784558&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1775784558&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=438579692&output=csv",
  ],
  clases: [
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1901056977&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1969468282&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1969468282&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1969468282&output=csv",
  ],
  rentals: [
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1647426432&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1939040620&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1939040620&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1939040620&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=1693469524&output=csv",
  ],
  traslados: [
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzJo7lxeJJWTziphdCL_J1e_oBJdGFxAIJ6fU2qWTekLAuHW60pt_hwtfifRHktxKTqGSAzCG-WBZJ/pub?gid=1978072612&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpZ6k2LPvKfrbjyCt00zTrD8ItDGYgzpQwIlHuFaBV-40ogah_HYEpYxBWG3Ue66u4KfFEyhFBHhqT/pub?gid=1194478962&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrgSNgmR8oRvUSBWiPH7971xx2p37mw1w958m0T0PwR6yNiEO3c1PaDWTSjkaAgyz4sJfYfwM8_i5v/pub?gid=1194478962&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTv5Ek5FqxuWJf8cu6C1BBMp8EIpuFKZy8yIv--8JKkhcbiB-rGEPiw2YfgJF9CvF3PSKla1JXSygPu/pub?gid=1194478962&output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxALEm1jwR3vFdfnJc-0XaURWP3lOlfRLsSkrbFnMuH-WpLrOdu0QrgLF5FrZ9kXzad1yHPsSUSJTQ/pub?gid=324871885&output=csv",
  ],
};

/**
 * Helper function to get all paquete URLs for a given centro
 */
export const getPaqueteUrls = (centroName) => {
  const config = PAQUETES_CONFIG[centroName];
  if (!config) {
    throw new Error(`Centro not found: ${centroName}`);
  }
  return {
    paquetesUrl: config.paquetesUrl,
    reglasUrl: config.reglasUrl,
  };
};

/**
 * Helper function to get all centro configurations
 */
export const getAllPaqueteConfigs = () => {
  return Object.values(PAQUETES_CONFIG);
};

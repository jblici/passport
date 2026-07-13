"use client";
import { useState, useMemo } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import FormCard from "../ui/FormCard";
import RequiredBadge from "../ui/RequiredBadge";
import { handleEquipos } from "@/app/lib/utils/secciones.jsx";
import { scrollToSection } from "@/app/lib/utils/extras";
import { cerros } from "../ui/cerros";
import DateField from "../ui/DateField";
import InfoAlert from "../ui/InfoAlert";
import { cerrosInfoEquipos } from "@/app/lib/config/cerrosInfo";
import { SEASON_MIN_DATE, SEASON_MAX_DATE } from "@/app/lib/config/spreadsheetConfig";
import { Search } from "lucide-react";

export default function Equipos({
  category,
  equipos,
  setEquipos,
  cerro,
  setCerro,
  startDate,
  setStartDate,
}) {
  const [dias, setDias] = useState("1");
  const [gama, setGama] = useState(null);

  const { cerrosDias, cerrosGamas } = useMemo(() => {
    if (!equipos) return { cerrosDias: {}, cerrosGamas: {} };
    const dias = {};
    const gamas = {};
    equipos.forEach(({ cerro, dias: d, gama }) => {
      if (d) { if (!dias[cerro]) dias[cerro] = new Set(); dias[cerro].add(d); }
      if (gama?.trim()) { if (!gamas[cerro]) gamas[cerro] = new Set(); gamas[cerro].add(gama); }
    });
    return {
      cerrosDias: Object.fromEntries(Object.entries(dias).map(([c, s]) => [c, Array.from(s).sort((a, b) => a - b)])),
      cerrosGamas: Object.fromEntries(Object.entries(gamas).map(([c, s]) => [c, Array.from(s)])),
    };
  }, [equipos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEquipos(cerro, equipos, setEquipos, startDate, Number(dias), gama);
  };

  const disabled = !(cerro && dias && startDate);

  return (
    <div className="h-fit w-full">
      <h1 className="text-center text-3xl font-bold mb-2">{category}</h1>
      <p className="text-center text-gray-600 mb-8">Selecciona el centro de esquí y el tipo de equipo</p>
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Centro + Días y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormCard icon="🎿" title="Centro y Equipo" subtitle="Selecciona tus preferencias">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="centro" className="font-semibold">
                    Centro <RequiredBadge />
                  </Label>
                  <Select id="centro" onValueChange={setCerro} value={cerro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Centro" />
                    </SelectTrigger>
                    {cerros}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dias" className="font-semibold">
                    Cantidad de Días <RequiredBadge />
                  </Label>
                  <Select id="dias" onValueChange={setDias} value={dias}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Días" />
                    </SelectTrigger>
                    <SelectContent>
                      {(cerrosDias[cerro] ?? Array.from({ length: 8 }, (_, i) => i + 1)).map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {d} día{d > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {cerrosGamas[cerro] && (
                  <div className="space-y-2">
                    <Label htmlFor="gama" className="font-semibold">
                      Gama
                    </Label>
                    <Select id="gama" onValueChange={setGama} value={gama || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Gama" />
                      </SelectTrigger>
                      <SelectContent>
                        {cerrosGamas[cerro]?.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </FormCard>

            {/* Fecha */}
            <FormCard icon="📅" title="Fecha del Viaje" subtitle="Elige la fecha de inicio">
              <DateField
                id="start-date"
                label="Fecha de Inicio"
                value={startDate}
                onChange={setStartDate}
                minDate={SEASON_MIN_DATE}
                maxDate={SEASON_MAX_DATE}
                required
              />
            </FormCard>
          </div>

          {/* Centro Info */}
          {cerrosInfoEquipos[cerro]?.detalles && (
            <InfoAlert title={cerrosInfoEquipos[cerro]?.titulo || cerro}>
              {cerrosInfoEquipos[cerro]?.detalles.map((detalle, idx) => (
                <div key={idx}>{detalle}</div>
              ))}
            </InfoAlert>
          )}

          {/* Botón */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 py-6 font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            onClick={scrollToSection}
            disabled={disabled}
          >
            <Search size={20} />
            Buscar Equipos
          </Button>
        </form>
      </div>
    </div>
  );
}

import axios from "axios";

export type Provincia = { id: string; nombre: string };
export type Localidad = { id: string; nombre: string };

export const fetchProvincias = async (pais: string): Promise<Provincia[]> => {
  try {
    if (pais === "Argentina") {
      const { data } = await axios.get(
        "https://apis.datos.gob.ar/georef/api/provincias",
        {
          params: { campos: "id,nombre" },
        }
      );
      return data.provincias || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching provincias:", error);
    return [];
  }
};

export const fetchLocalidades = async (
  pais: string,
  provinciaId: string
): Promise<Localidad[]> => {
  try {
    if (pais === "Argentina") {
      const { data } = await axios.get(
        "https://apis.datos.gob.ar/georef/api/localidades",
        {
          params: {
            provincia: provinciaId,
            campos: "id,nombre",
            max: 5000,
          },
        }
      );
      return data.localidades || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching localidades:", error);
    return [];
  }
};

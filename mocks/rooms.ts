
export type Room = {
  id: string;
  title: string;        // "Sala A – Grabación"
  priceHour: number;    // 8500
  capacity?: number;    // 2, 4, etc. (opcional)
  features?: string[];  // ["Consola SSL", "Mic Neumann", ...]
};

const DEFAULT_ROOMS: Room[] = [
  { id: "a", title: "Sala A – Grabación", priceHour: 8500, capacity: 2, features: ["Consola", "Mic Pro", "Tratamiento"] },
  { id: "b", title: "Sala B – Ensayo",    priceHour: 5200, capacity: 4, features: ["Backline", "PA", "Aire Acond."] },
  { id: "c", title: "Sala C – Producción",priceHour: 3800, capacity: 1, features: ["Monitores", "MIDI", "Sillón"] },
];

// Mapear por estudio (usar clave = id/slug de la URL)
const ROOMS_BY_STUDIO: Record<string, Room[]> = {
  harmony: DEFAULT_ROOMS,
  luna: [
    { id: "v1", title: "Voz – Booth", priceHour: 6000, capacity: 1, features: ["Booth seco", "Pop Filter", "TLM"] },
    { id: "m1", title: "Mezcla",      priceHour: 7200, capacity: 1, features: ["Monitores Genelec", "Preamps UA"] },
  ],
  santelmo: DEFAULT_ROOMS,
  recoleta: DEFAULT_ROOMS,
  urquiza: DEFAULT_ROOMS,
  colegiales: DEFAULT_ROOMS,
  belgrano: DEFAULT_ROOMS,
  caballito: DEFAULT_ROOMS,
  boedo: DEFAULT_ROOMS,
  chacarita: DEFAULT_ROOMS,
};

export function getRoomsMockByStudioId(id: string): Room[] {
  const key = (id || "").toLowerCase();
  return ROOMS_BY_STUDIO[key] ?? DEFAULT_ROOMS;
}

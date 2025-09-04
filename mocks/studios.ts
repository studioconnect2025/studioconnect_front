
export type Studio = {
  name: string;
  rating: number;
  location: string;      
  description: string;
  amenities: string[];  
  photos?: string[];
};

const STUDIOS: Record<string, Studio> = {
  // 1) Palermo
  harmony: {
    name: "Harmony Studios",
    rating: 4.8,
    location: "Palermo, Buenos Aires",
    description:
      "Estudio profesional con cabinas tratadas, consola de mezcla y backline completo. Ideal para grabación, mezcla y pre-producción.",
    amenities: ["Internet de fibra", "Monitores Neumann", "Consola SSL", "Aire acondicionado"],
  },

  // 2) Almagro
  luna: {
    name: "Luna Records",
    rating: 4.6,
    location: "Almagro, Buenos Aires",
    description:
      "Sala principal con tratamiento acústico y control room independiente. Perfecto para sesiones vocales e instrumentales.",
    amenities: ["Wi-Fi 600Mb", "Monitores Genelec", "Preamps UA", "Café de cortesía"],
  },

  // 3) San Telmo
  santelmo: {
    name: "San Telmo Records",
    rating: 4.7,
    location: "San Telmo, Buenos Aires",
    description:
      "Sonido cálido con sala de tomas de ladrillo visto. Excelente para bandas en vivo y sets acústicos.",
    amenities: ["Micros Shure/AKG", "Cabina aislada", "Piano vertical", "Sala lounge"],
  },

  // 4) Recoleta
  recoleta: {
    name: "Recoleta Audio Suite",
    rating: 4.5,
    location: "Recoleta, Buenos Aires",
    description:
      "Espacio premium para mezcla y mastering con monitores de alta precisión y acondicionamiento acústico de primer nivel.",
    amenities: ["Tratamiento acústico", "Monitores Focal", "Outboard analógico", "Sillón ergonómico"],
  },

  // 5) Villa Urquiza
  urquiza: {
    name: "Urquiza Studio Lab",
    rating: 4.4,
    location: "Villa Urquiza, Buenos Aires",
    description:
      "Estudio versátil orientado a producción urbana y electrónica. Workflow rápido con control room híbrido.",
    amenities: ["Control híbrido", "MIDI controllers", "Subwoofer dedicado", "Iluminación RGB"],
  },

  // 6) Colegiales
  colegiales: {
    name: "Colegiales Room",
    rating: 4.6,
    location: "Colegiales, Buenos Aires",
    description:
      "Ambiente silencioso en pasaje arbolado. Ideal para locución, podcast y overdubs precisos.",
    amenities: ["Cabina voice-over", "Mic Neumann TLM", "Interface Apogee", "Tratamiento vocal"],
  },

  // 7) Belgrano
  belgrano: {
    name: "Belgrano Pro Studio",
    rating: 4.7,
    location: "Belgrano, Buenos Aires",
    description:
      "Sala amplia con luz natural y backline para ensayos pro y pre-producción de shows.",
    amenities: ["Batería DW", "Amplis Fender/Marshall", "PA QSC", "Aire acondicionado"],
  },

  // 8) Caballito
  caballito: {
    name: "Caballito Sessions",
    rating: 4.5,
    location: "Caballito, Buenos Aires",
    description:
      "Cuarto de control optimizado para mezcla ITB/OTB y edición. Ideal para proyectos independientes.",
    amenities: ["Control ITB/OTB", "Preamps Focusrite", "Paneles difusores", "Sillón reclinable"],
  },

  // 9) Boedo
  boedo: {
    name: "Boedo Groove",
    rating: 4.3,
    location: "Boedo, Buenos Aires",
    description:
      "Setup práctico para beats, voces y guitarras. Excelente relación calidad/precio para sesiones rápidas.",
    amenities: ["Mic Rode NT1", "Pads Akai", "Cabina seca", "Wi-Fi alta velocidad"],
  },

  // 10) Chacarita
  chacarita: {
    name: "Chacarita Sound",
    rating: 4.6,
    location: "Chacarita, Buenos Aires",
    description:
      "Estudio moderno dentro de polo audiovisual. Cadena de señal cuidada y sala de ensayo anexa.",
    amenities: ["Compresores 1176", "DI Radial", "Sala anexa", "Estacionamiento"],
  },
};

export function getStudioMockById(id: string): Studio {
  const key = (id || "").toLowerCase();
  return (
    STUDIOS[key] ?? {
      name: "Estudio sin nombre",
      rating: 0,
      location: "—",
      description: "Descripción pendiente.",
      amenities: ["Amenity 1", "Amenity 2"],
    }
  );
}

export function getStudioPhotos(id: string, count = 5): string[] {
  const s = getStudioMockById(id);
  const base =
    s.photos && s.photos.length
      ? s.photos
      : Array.from({ length: count }, (_, i) =>
          `https://placehold.co/800x220/png?text=${encodeURIComponent(s.name)}+${i + 1}`
        );

  return base.slice(0, count);
}


export { STUDIOS };

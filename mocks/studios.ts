// Tipos
export type Review = {
  id: string; // r-<slug>-<n>
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: `${number}-${number}-${number}`; // YYYY-MM-DD
  comment: string;
};

export type Studio = {
  name: string;
  rating: number;
  location: string;
  description: string;
  amenities: string[];
  photos?: string[];
  address?: string;
  mapQuery?: string;
  reviews: Review[]; // agregado

  pricePerHour?: number;

};

// Mock principal
const STUDIOS: Record<string, Studio> = {
  // 1) Palermo
  harmony: {
    name: "Harmony Studios",
    rating: 4.8,
    location: "Palermo, Buenos Aires",
    description:
      "Estudio profesional con cabinas tratadas, consola de mezcla y backline completo. Ideal para grabación, mezcla y pre-producción.",
    amenities: ["Internet de fibra", "Monitores Neumann", "Consola SSL", "Aire acondicionado"],

    address: "Av. Santa Fe 3200, Palermo, Buenos Aires, AR",
    mapQuery: "Av. Santa Fe 3200, Palermo, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-harmony-1",
        author: "María Romero",
        rating: 5,
        date: "2025-06-10",
        comment:
          "Equipo de primera y atención excelente. La calidad de sonido fue perfecta.",
      },
      {
        id: "r-harmony-2",
        author: "Daiana Rodríguez",
        rating: 5,
        date: "2024-12-05",
        comment:
          "Ubicación y servicio profesional. Volvería a contratarlos sin duda.",
      },
    ],

    photos: ["/studios/studio1.jpg"],
    pricePerHour: 3500

  },

  // 2) Almagro
  luna: {
    name: "Luna Records",
    rating: 4.6,
    location: "Almagro, Buenos Aires",
    description:
      "Sala principal con tratamiento acústico y control room independiente. Perfecto para sesiones vocales e instrumentales.",
    amenities: ["Wi-Fi 600Mb", "Monitores Genelec", "Preamps UA", "Café de cortesía"],

    address: "Av. Rivadavia 4200, Almagro, Buenos Aires, AR",
    mapQuery: "Av. Rivadavia 4200, Almagro, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-luna-1",
        author: "Santiago López",
        rating: 5,
        date: "2025-05-28",
        comment:
          "Control room impecable. Los Genelec tradujeron perfecto a otros sistemas.",
      },
      {
        id: "r-luna-2",
        author: "Carolina Díaz",
        rating: 4,
        date: "2025-01-14",
        comment:
          "Muy buena atención y café. Reservo de nuevo para voces la semana próxima.",
      },
    ],

    photos: ["/studios/studio2.jpg"],
    pricePerHour: 3000

  },

  // 3) San Telmo
  santelmo: {
    name: "San Telmo Records",
    rating: 4.7,
    location: "San Telmo, Buenos Aires",
    description:
      "Sonido cálido con sala de tomas de ladrillo visto. Excelente para bandas en vivo y sets acústicos.",
    amenities: ["Micros Shure/AKG", "Cabina aislada", "Piano vertical", "Sala lounge"],

    address: "Defensa 900, San Telmo, Buenos Aires, AR",
    mapQuery: "Defensa 900, San Telmo, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-santelmo-1",
        author: "Nicolás Ferreyra",
        rating: 5,
        date: "2025-03-09",
        comment:
          "El carácter de la sala te hace tocar mejor. Reverb natural hermosa.",
      },
      {
        id: "r-santelmo-2",
        author: "Julieta Álvarez",
        rating: 5,
        date: "2024-11-22",
        comment:
          "Piano muy bien mantenido. Grabamos dos temas en una tarde sin problemas.",
      },
    ],

    photos: ["/studios/studio3.jpg"],
    pricePerHour: 2800

  },

  // 4) Recoleta
  recoleta: {
    name: "Recoleta Audio Suite",
    rating: 4.5,
    location: "Recoleta, Buenos Aires",
    description:
      "Espacio premium para mezcla y mastering con monitores de alta precisión y acondicionamiento acústico de primer nivel.",
    amenities: ["Tratamiento acústico", "Monitores Focal", "Outboard analógico", "Sillón ergonómico"],

    address: "Av. Alvear 1600, Recoleta, Buenos Aires, AR",
    mapQuery: "Av. Alvear 1600, Recoleta, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-recoleta-1",
        author: "Pedro Sánchez",
        rating: 4,
        date: "2025-04-16",
        comment:
          "Sala súper silenciosa. El outboard suma, pero ya ITB va excelente.",
      },
      {
        id: "r-recoleta-2",
        author: "Rocío Herrera",
        rating: 5,
        date: "2024-12-18",
        comment:
          "Mastering transparente y prolijo. Entrega con DDP y todo en regla.",
      },
    ],

    photos: ["/studios/studio4.jpg"],
    pricePerHour: 3200

  },

  // 5) Villa Urquiza
  urquiza: {
    name: "Urquiza Studio Lab",
    rating: 4.4,
    location: "Villa Urquiza, Buenos Aires",
    description:
      "Estudio versátil orientado a producción urbana y electrónica. Workflow rápido con control room híbrido.",
    amenities: ["Control híbrido", "MIDI controllers", "Subwoofer dedicado", "Iluminación RGB"],

    address: "Av. Triunvirato 4800, Villa Urquiza, Buenos Aires, AR",
    mapQuery: "Av. Triunvirato 4800, Villa Urquiza, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-urquiza-1",
        author: "Martina Vega",
        rating: 4,
        date: "2025-02-07",
        comment:
          "Ideal para beats. La cadena para voces quedó súper limpia y directa.",
      },
      {
        id: "r-urquiza-2",
        author: "Iván Pereyra",
        rating: 5,
        date: "2024-10-30",
        comment:
          "Subwoofer calibrado. Mezclar low-end fue más fácil de lo habitual.",
      },
    ],

    photos: ["/studios/studio5.jpg"],
    pricePerHour: 2800

  },

  // 6) Colegiales
  colegiales: {
    name: "Colegiales Room",
    rating: 4.6,
    location: "Colegiales, Buenos Aires",
    description:
      "Ambiente silencioso en pasaje arbolado. Ideal para locución, podcast y overdubs precisos.",
    amenities: ["Cabina voice-over", "Mic Neumann TLM", "Interface Apogee", "Tratamiento vocal"],

    address: "Conde 600, Colegiales, Buenos Aires, AR",
    mapQuery: "Conde 600, Colegiales, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-colegiales-1",
        author: "Belén Torres",
        rating: 5,
        date: "2025-06-02",
        comment:
          "Silencio absoluto. Para locuciones largas, cero fatiga y gran toma.",
      },
      {
        id: "r-colegiales-2",
        author: "Germán Rivas",
        rating: 4,
        date: "2025-01-09",
        comment:
          "Cadena TLM + Apogee muy nítida. Entregamos podcast en el día.",
      },
    ],

    photos: ["/studios/studio6.jpg"],
    pricePerHour: 2500

  },

  // 7) Belgrano
  belgrano: {
    name: "Belgrano Pro Studio",
    rating: 4.7,
    location: "Belgrano, Buenos Aires",
    description:
      "Sala amplia con luz natural y backline para ensayos pro y pre-producción de shows.",
    amenities: ["Batería DW", "Amplis Fender/Marshall", "PA QSC", "Aire acondicionado"],

    address: "Av. Cabildo 2200, Belgrano, Buenos Aires, AR",
    mapQuery: "Av. Cabildo 2200, Belgrano, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-belgrano-1",
        author: "Ana María Ponce",
        rating: 5,
        date: "2025-05-11",
        comment:
          "Backline completo y en ótimo estado. Ensayo salió redondo.",
      },
      {
        id: "r-belgrano-2",
        author: "Tomás Quiroga",
        rating: 4,
        date: "2024-09-17",
        comment:
          "Sala cómoda para banda completa. Buena atención del staff.",
      },
    ],

    photos: ["/studios/studio6.jpg"],
    pricePerHour: 3500

  },

  // 8) Caballito
  caballito: {
    name: "Caballito Sessions",
    rating: 4.5,
    location: "Caballito, Buenos Aires",
    description:
      "Cuarto de control optimizado para mezcla ITB/OTB y edición. Ideal para proyectos independientes.",
    amenities: ["Control ITB/OTB", "Preamps Focusrite", "Paneles difusores", "Sillón reclinable"],

    address: "Av. José María Moreno 700, Caballito, Buenos Aires, AR",
    mapQuery: "Av. José María Moreno 700, Caballito, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-caballito-1",
        author: "Valentina Rossi",
        rating: 4,
        date: "2025-03-21",
        comment:
          "Edición ágil. La acústica ayuda a decidir rápido EQ y compresión.",
      },
      {
        id: "r-caballito-2",
        author: "Lucas Benítez",
        rating: 5,
        date: "2024-12-01",
        comment:
          "Buen balance entre equipo y precio. Recomendado para freelance.",
      },
    ],

    photos: ["/studios/studio6.jpg"],
    pricePerHour: 2800

  },

  // 9) Boedo
  boedo: {
    name: "Boedo Groove",
    rating: 4.3,
    location: "Boedo, Buenos Aires",
    description:
      "Setup práctico para beats, voces y guitarras. Excelente relación calidad/precio para sesiones rápidas.",
    amenities: ["Mic Rode NT1", "Pads Akai", "Cabina seca", "Wi-Fi alta velocidad"],

    address: "Av. San Juan 3500, Boedo, Buenos Aires, AR",
    mapQuery: "Av. San Juan 3500, Boedo, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-boedo-1",
        author: "Federico M.",
        rating: 4,
        date: "2025-04-02",
        comment:
          "Para grabar voces y guitarras, va como piña. Rápido y efectivo.",
      },
      {
        id: "r-boedo-2",
        author: "Paula Giménez",
        rating: 5,
        date: "2024-10-08",
        comment:
          "NT1 rendidor y cabina bien seca. Entregamos demo en el día.",
      },
    ],

    photos: ["/studios/studio6.jpg"],
    pricePerHour: 2200

  },

  // 10) Chacarita
  chacarita: {
    name: "Chacarita Sound",
    rating: 4.6,
    location: "Chacarita, Buenos Aires",
    description:
      "Estudio moderno dentro de polo audiovisual. Cadena de señal cuidada y sala de ensayo anexa.",
    amenities: ["Compresores 1176", "DI Radial", "Sala anexa", "Estacionamiento"],

    address: "Av. Corrientes 6200, Chacarita, Buenos Aires, AR",
    mapQuery: "Av. Corrientes 6200, Chacarita, Buenos Aires, Argentina",
    reviews: [
      {
        id: "r-chacarita-1",
        author: "Agustín L.",
        rating: 5,
        date: "2025-06-01",
        comment:
          "Los 1176 hacen magia en voces. Muy prolijo todo el ruteo.",
      },
      {
        id: "r-chacarita-2",
        author: "Micaela Duarte",
        rating: 4,
        date: "2025-01-27",
        comment:
          "Ubicado cómodo y con estacionamiento. Ensayo anexo sumó mucho.",
      },
    ],

    photos: ["/studios/studio6.jpg"],
    pricePerHour: 3000

  },
};

// Helpers
export function getStudioMockById(id: string): Studio {
  const key = (id || "").toLowerCase();
  return (
    STUDIOS[key] ?? {
      name: "Estudio sin nombre",
      rating: 0,
      location: "—",
      description: "Descripción pendiente.",
      amenities: ["Amenity 1", "Amenity 2"],
      reviews: [], // para evitar errores de render
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

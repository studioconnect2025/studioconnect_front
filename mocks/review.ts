export type Review = {
  name: string;
  role: string;
  rating: number; 
  comment: string;
  avatarUrl?: string; 
};

export const REVIEWS: Review[] = [
  {
    name: "Michael Chen",
    role: "Baterista",
    rating: 5,
    comment:
      "Encontré un estudio increíble en mi ciudad en menos de 5 minutos. La reserva fue súper fácil y todo estuvo listo cuando llegué. StudioConnect me ahorra horas de búsqueda.",
    avatarUrl: "/avatars/avatar1.jpg",
  },
  {
    name: "Emily Rodríguez",
    role: "Cantante",
    rating: 5,
    comment:
      "Como cantante independiente, siempre me costaba encontrar un lugar confiable para grabar. Con StudioConnect descubrí estudios que ni sabía que existían cerca mío.",
    avatarUrl: "/avatars/avatar2.jpg",
  },
  {
    name: "David Thompson",
    role: "Guitarrista",
    rating: 5,
    comment:
      "Lo mejor es que puedo comparar precios y horarios en un solo lugar. Reservar un ensayo nunca fue tan simple.",
    avatarUrl: "/avatars/avatar3.jpg",
  },
  {
    name: "Lisa Wang",
    role: "Anfitriona",
    rating: 5,
    comment:
      "Desde que publiqué mi estudio en StudioConnect recibo más reservas cada semana. Es como tener un asistente que trabaja todo el día por mí.",
    avatarUrl: "/avatars/avatar4.jpg",
  },
  {
    name: "James Wilson",
    role: "Anfitrión",
    rating: 5,
    comment:
      "Antes dependía del boca en boca. Ahora los músicos me encuentran fácilmente y puedo gestionar todo en línea. StudioConnect cambió mi negocio.",
    avatarUrl: "/avatars/avatar5.jpg",
  },
  {
    name: "Rachel Green",
    role: "Anfitriona",
    rating: 5,
    comment:
      "La plataforma es clara, rápida y me da visibilidad. Ya no pierdo tiempo coordinando por WhatsApp, todo queda registrado en las reservas.",
    avatarUrl: "/avatars/avatar6.jpg",
  },
];

export default REVIEWS;

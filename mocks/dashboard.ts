// lib/api/dashboard.ts

export type Metric = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string; // "calendar", "dollar", "star", "building"
};

export type Reservation = {
  id: string;
  client: string;
  studio: string;
  hours: number;
  amount: number;
  date: string; // ISO date
};

export type UpcomingReservation = {
  id: string;
  title: string;
  studio: string;
  client: string;
  date: string; // ISO
  start: string;
  end: string;
  status: "Confirmado" | "Pendiente";
};

export type Message = {
  id: string;
  author: string;
  text: string;
  timeAgo: string; // "2m", "1h", etc.
};

const METRICS: Metric[] = [
  { id: "m1", title: "Este mes", value: "47", subtitle: "+12% Desde el último mes", icon: "calendar" },
  { id: "m2", title: "Este mes", value: "$5,640", subtitle: "+8% Desde el último mes", icon: "dollar" },
  { id: "m3", title: "Promedio", value: "4.8", subtitle: "Basado en 89 reseñas", icon: "star" },
  { id: "m4", title: "Activos", value: "3", subtitle: "Todos los estudios activos", icon: "building" },
];

const RECENT_RESERVATIONS: Reservation[] = [
  { id: "r1", client: "Maria Jonnes", studio: "Harmony Studios", hours: 2, amount: 200000, date: "2025-06-15" },
  { id: "r2", client: "Micaela Rodriguez", studio: "Harmony Studios", hours: 2, amount: 20000, date: "2025-06-14" },
  { id: "r3", client: "Metallica", studio: "Harmony Studios", hours: 6, amount: 720000, date: "2025-06-13" },
];

const UPCOMING_RESERVATIONS: UpcomingReservation[] = [
  { id: "u1", title: "Sesión de grabación", studio: "Harmony Studios", client: "Emma Lopez", date: "2025-06-16", start: "14:00", end: "18:00", status: "Confirmado" },
  { id: "u2", title: "Práctica de banda", studio: "Echo Chamber", client: "Megadeth", date: "2025-06-17", start: "19:00", end: "23:00", status: "Pendiente" },
  { id: "u3", title: "Grabación en solitario", studio: "Harmony Studios", client: "Alex Perez", date: "2025-06-18", start: "10:00", end: "14:00", status: "Confirmado" },
];

const MESSAGES: Message[] = [
  { id: "msg1", author: "Luisa Park", text: "Hola! Me gustaría reservar tu estudio para la semana que viene...", timeAgo: "2m" },
  { id: "msg2", author: "David Wilson", text: "¡Gracias por la gran sesión de ayer!", timeAgo: "1h" },
  { id: "msg3", author: "Metallica", text: "¿Podemos ampliar nuestra reserva 2 horas más?", timeAgo: "3h" },
];

// Simulación de delay de red
function delay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export async function getMetrics(): Promise<Metric[]> {
  return delay(METRICS);
}

export async function getRecentReservations(): Promise<Reservation[]> {
  return delay(RECENT_RESERVATIONS);
}

export async function getUpcomingReservations(): Promise<UpcomingReservation[]> {
  return delay(UPCOMING_RESERVATIONS);
}

export async function getMessages(): Promise<Message[]> {
  return delay(MESSAGES);
}

/*  Para backend luego:
export async function getMetrics() {
  const res = await fetch("http://localhost:3003/api/dashboard/metrics");
  return res.json();
}
*/

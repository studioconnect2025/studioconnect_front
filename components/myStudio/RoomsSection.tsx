// components/myStudio/RoomsSection.tsx
type Room = {
  id: string;
  name: string;
  type?: string;
  sizeM2?: number;
  minHours?: number;
  pricePerHour?: number;
};

export default function RoomsSection({ rooms = [] }: { rooms: Room[] }) {
  if (!rooms.length) {
    return (
      <section className="relative rounded-2xl overflow-hidden shadow-[0_12px_12px_-12px_rgba(2,6,23,0.28)] ring-1 ring-white/10 bg-gradient-to-b from-[#0F3B57] via-[#0B2746] to-[#071E32] backdrop-blur-md p-4 md:p-6">
        <div className="text-white/80 text-sm">Aún no hay salas cargadas.</div>
      </section>
    );
  }

  return (
    <section className="relative rounded-2xl overflow-hidden shadow-[0_12px_12px_-12px_rgba(2,6,23,0.28)] ring-1 ring-white/10 bg-gradient-to-b from-[#0F3B57] via-[#0B2746] to-[#071E32] backdrop-blur-md p-4 md:p-6">
      {/* highlight sutil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

      <div className="relative space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="relative rounded-xl border border-white/12 bg-white/5 backdrop-blur-[2px] p-4 flex items-start justify-between"
          >
            {/* brillo fino arriba de cada card */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-xl" />

            <div className="relative">
              <h4 className="font-medium text-white/90">
                {room.name ?? "Sala"}
              </h4>
              <p className="mt-1 text-sm text-white/70">
                {(room.type || "Tipo")} • {(room.sizeM2 ? `${room.sizeM2} m²` : "m²")} •{" "}
                {(room.minHours ? `Min. ${room.minHours} hs` : "Min. hs")} •{" "}
                {(room.pricePerHour ? `$${room.pricePerHour}/hora` : "$/hora")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

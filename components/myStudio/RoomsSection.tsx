export default function RoomsSection() {
  return (
    <section
      className="relative rounded-2xl overflow-hidden shadow-[0_12px_12px_-12px_rgba(2,6,23,0.28)] ring-1 ring-white/10
                 bg-gradient-to-b from-[#0F3B57] via-[#0B2746] to-[#071E32] backdrop-blur-md p-4 md:p-6"
    >
      {/* Highlight superior sutil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

      <h3 className="relative text-lg font-semibold text-white/95 mb-3">Mis salas</h3>

      <div className="relative space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative rounded-xl border border-white/12 bg-white/5 backdrop-blur-[2px] p-4
                       flex items-start justify-between"
          >
            {/* Brillo fino arriba de cada card */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-xl" />

            <div className="relative">
              <h4 className="font-medium text-white/90">Sala {i} — Nombre</h4>
              <p className="mt-1 text-sm text-white/70">Tipo • m² • Min. x hs • $/hora</p>
            </div>

            {/* 🔻 Acciones removidas a pedido (no Editar / Eliminar por sala) */}
          </div>
        ))}
      </div>
    </section>
  );
}

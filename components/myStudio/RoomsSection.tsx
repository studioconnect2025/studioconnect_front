export default function RoomsSection() {
  return (
    <section
      className="
        relative rounded-2xl overflow-hidden
        shadow-[0_12px_32px_rgba(2,6,23,0.28)]
        ring-1 ring-white/10
        bg-gradient-to-b from-[#0E3B53] via-[#0A2F46] to-[#071E2E]
        p-6
      "
    >
      {/* Highlight superior sutil, como la referencia */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

      <h3 className="relative text-lg font-semibold text-white/95 mb-4">Mis salas</h3>

      <div className="relative space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="
              relative rounded-xl border border-white/12
              bg-white/[0.06] backdrop-blur-[2px]
              p-4 flex items-start justify-between
              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
            "
          >
            {/* brillo fino arriba de cada card */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-xl" />

            <div className="relative">
              <h4 className="font-medium text-white/95">Sala {i} — Nombre</h4>
              <p className="text-sm text-white/70">
                Tipo • m² • Min. x hs • $/hora
              </p>
            </div>

            <div className="relative flex gap-2">
              <button
                className="
                  px-3 py-1 rounded-lg
                  border border-white/15 text-white/90
                  hover:bg-white/10 transition
                "
              >
                Editar
              </button>
              <button
                className="
                  px-3 py-1 rounded-lg text-white
                  bg-[#b91c1c] hover:bg-[#991b1b] transition
                "
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

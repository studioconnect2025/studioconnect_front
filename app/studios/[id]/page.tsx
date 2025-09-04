import Gallery from "@/components/studio/Gallery";
import { getStudioMockById, type Studio, getStudioPhotos } from "@/mocks/studios";
import { getRoomsMockByStudioId, type Room } from "@/mocks/rooms";

export default async function StudioDetailsPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Datos mock dinámicos
  const studio: Studio = getStudioMockById(id);
  const rooms: Room[] = getRoomsMockByStudioId(id);
  const photos: string[] = getStudioPhotos(id); // siempre te da hasta 5

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0B0F12]">
      <div className="mx-auto max-w-[1216px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:[grid-template-columns:800px_384px] gap-8">
          <div className="space-y-6">

            {/* Sección 1 — Galería (dinámica) */}
            <section className="rounded-lg border border-[#E5E7EB] bg-white p-4">
              <Gallery photos={photos} altBase={studio.name} />
            </section>

            {/* Sección 2 — Tarjeta del estudio (header) dinámica */}
            <section className="rounded-lg border border-[#E5E7EB] bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 text-white">
              {/* fila superior: título + acciones */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold leading-tight">{studio.name}</h2>
                  <p className="mt-1 text-xs text-white/85">
                    ⭐ {studio.rating} · {studio.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/15">
                    Guardar
                  </button>
                  <button className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/15">
                    Compartir
                  </button>
                  <button
                    aria-label="Más"
                    className="grid h-7 w-7 place-items-center rounded-md border border-white/20 bg-white/10 hover:bg-white/15"
                  >
                    ⋯
                  </button>
                </div>
              </div>

              {/* descripción */}
              <p className="mt-3 text-[12px] leading-relaxed text-white/90">
                {studio.description}
              </p>

              {/* separador sutil */}
              <div className="my-3 h-px bg-white/10" />

              {/* subtítulo + chips (equipos y comodidades) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium text-white/90">Equipos y comodidades</span>
                {studio.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-[11px]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>

            {/* Sección 3 — Salas disponibles (dinámica) */}
            <section className="rounded-lg border border-[#E5E7EB] bg-white p-4">
              <h2 className="text-[18px] font-semibold">Salas disponibles</h2>

              <div className="mt-3 space-y-3">
                {rooms.map((room) => (
                  <div key={room.id} className="rounded-md border border-[#E5E7EB] p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium">{room.title}</h3>
                        <p className="mt-1 text-xs text-[#0B0F12]/70">
                          {room.capacity ? `Capacidad: ${room.capacity} · ` : ""}
                          {room.features?.slice(0, 3).join(" · ")}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          ${" "}
                          {room.priceHour.toLocaleString("es-AR")}
                          {" "}
                          <span className="text-xs font-normal text-[#0B0F12]/70">/ hora</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs hover:bg-gray-50">
                            Ver detalles
                          </button>
                          <button className="rounded-md bg-[#0B0F12] px-3 py-1.5 text-xs text-white hover:opacity-90">
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 4 — Ubicación (mapa 800 × 418) */}
            <section className="rounded-lg border border-[#E5E7EB] bg-white p-4">
              <h2 className="text-lg font-semibold">Ubicación</h2>
              <div className="mt-2 mx-auto w-full lg:max-w-[800px]">
                <div className="h-[418px] w-full rounded-lg bg-[#F3F4F6]" />
              </div>
              <p className="mt-2 text-sm text-[#0B0F12]/70">
                {studio.location}
              </p>
            </section>

            {/* Sección 5 — Reseñas (placeholder) */}
            <section className="h-[300px] rounded-lg border border-[#E5E7EB] bg-white p-4">
              <div className="h-full w-full opacity-70">Reseñas (placeholder)</div>
            </section>
          </div>

          {/* Sección 6 — Panel lateral (384px) */}
          <aside>
            <div className="sticky top-20">
              <div className="min-h-[320px] rounded-lg border border-[#E5E7EB] bg-white p-4">
                Sidebar reserva (placeholder)
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

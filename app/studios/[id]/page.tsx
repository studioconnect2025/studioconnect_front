import Gallery from "@/components/studio/Gallery";
import { getStudioMockById, type Studio, getStudioPhotos } from "@/mocks/studios";
import { getRoomsMockByStudioId, type Room } from "@/mocks/rooms";

function Stars({ value }: { value: number }) {
  const filled = Math.round(value);
  return (
    <div className="flex" aria-label={`Puntaje ${value} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[#f5b50a] text-base leading-none">
          {i < filled ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });
}

export type ParamsType = Promise<{ id: string }>;

type Props = {
  params: ParamsType;
};

export default async function StudioDetailsPage({ params }: Props) {
  const { id } = await params;
  const studio: Studio = getStudioMockById(id);
  const rooms: Room[] = getRoomsMockByStudioId(id);
  const photos: string[] = getStudioPhotos(id);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0B0F12]">
      <div className="mx-auto max-w-[1216px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:[grid-template-columns:800px_384px] gap-6">

          {/* Columna izquierda */}
          <div className="space-y-6">

            {/* Sección 1 — Galería */}
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <Gallery photos={photos} altBase={studio.name} />
            </section>

            {/* Sección 2 — Tarjeta del estudio */}
            <section className="rounded-2xl border border-[#E5E7EB] bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[18px] leading-6 font-semibold">{studio.name}</h2>
                  <p className="mt-1 text-xs text-white/85">
                    ⭐ {studio.rating} · {studio.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/15">Guardar</button>
                  <button className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/15">Compartir</button>
                  <button aria-label="Más" className="grid h-7 w-7 place-items-center rounded-md border border-white/20 bg-white/10 hover:bg-white/15">⋯</button>
                </div>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-white/90">{studio.description}</p>
              <div className="my-3 h-px bg-white/10" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium text-white/90">Equipos y comodidades</span>
                {studio.amenities.map((a) => (
                  <span key={a} className="rounded-md border border-white/15 bg-white/10 px-2 py-[3px] text-[11px]">{a}</span>
                ))}
              </div>
            </section>

            {/* Sección 3 — Salas disponibles */}
            <section className="rounded-2xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 text-white">
              <h2 className="text-[18px] leading-6 font-semibold">Salas disponibles</h2>
              <div className="mt-3 space-y-3">
                {rooms.map((room) => (
                  <div key={room.id} className="rounded-xl border border-white/15 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-white">{room.title}</h3>
                        <p className="mt-1 text-xs text-white/80">
                          {room.capacity ? `Capacidad: ${room.capacity} · ` : ""}
                          {room.features?.slice(0, 3).join(" · ")}
                        </p>
                        {room.features?.length && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {room.features.slice(0, 3).map((t: string) => (
                              <span key={t} className="rounded-md border border-white/15 bg-white/10 px-2 py-[3px] text-[11px] text-white/90">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          ${" "}{room.priceHour.toLocaleString("es-AR")}<span className="text-xs font-normal text-white/70">/ hora</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15">Ver detalles</button>
                          <button className="rounded-md bg-white px-3 py-1.5 text-xs text-[#0B0F12] hover:opacity-90">Reservar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 4 — Ubicación */}
            <section className="rounded-2xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 text-white">
              <h2 className="text-[18px] leading-6 font-semibold">Ubicación</h2>
              <div className="mt-3 mx-auto w-full lg:max-w-[800px]">
                <div className="relative w-full rounded-2xl overflow-hidden bg-white" style={{ aspectRatio: "800 / 418", minHeight: 418 }}>
                  <iframe
                    title={`Ubicación de ${studio.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(studio.mapQuery ?? studio.location ?? "")}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-white/80">{studio.address ?? studio.location}</p>
            </section>

            {/* Sección 5 — Reseñas */}
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <h2 className="text-[18px] leading-6 font-semibold">Reseñas ({studio.reviews?.length ?? 0})</h2>
              <ul className="mt-3 space-y-3">
                {(studio.reviews ?? []).slice(0, 2).map((rev: any) => (
                  <li key={rev.id} className="rounded-xl border border-[#E5E7EB] bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-black/10" />
                        <div>
                          <p className="text-sm font-medium">{rev.author}</p>
                          <p className="text-xs text-black/50">{formatMonthYear(rev.date)}</p>
                        </div>
                      </div>
                      <Stars value={rev.rating} />
                    </div>
                    <p className="mt-2 text-sm text-black/80">{rev.comment}</p>
                  </li>
                ))}
              </ul>
              {(studio.reviews?.length ?? 0) > 2 && <button className="mt-3 text-sm underline">Mostrar todas las reseñas</button>}
            </section>

          </div>{/* ← cierra columna izquierda */}

          {/* Columna derecha */}
          <aside>
            <div className="sticky top-20 space-y-4">
              {/* Card: Reserva */}
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[18px] font-semibold">$ 400.000<span className="text-sm font-normal"> /4hs</span></p>
                  <span className="text-xs text-[#0B0F12]/60">Mínimo 2 horas</span>
                </div>
                <div className="mt-4 space-y-3">
                  {/* Fecha */}
                  <div>
                    <label className="mb-1 block text-sm text-[#0B0F12]/80">Fecha</label>
                    <input type="text" placeholder="mm/dd/yyyy" className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#036D9D]" />
                  </div>
                  {/* Horas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm text-[#0B0F12]/80">Hora de inicio</label>
                      <select className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#036D9D]">
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-[#0B0F12]/80">Hora de salida</label>
                      <select className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#036D9D]">
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>1:00 PM</option>
                      </select>
                    </div>
                  </div>
                  {/* Sala */}
                  <div>
                    <label className="mb-1 block text-sm text-[#0B0F12]/80">Salas disponibles</label>
                    <select className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#036D9D]">
                      {rooms.map((r) => <option key={r.id}>{r.title}</option>)}
                    </select>
                  </div>
                  {/* Personas */}
                  <div>
                    <label className="mb-1 block text-sm text-[#0B0F12]/80">Número de personas</label>
                    <select className="w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#036D9D]">
                      <option>1</option><option>2</option><option>3</option><option>4</option>
                    </select>
                  </div>
                  {/* Breakdown */}
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#0B0F12]/70">$200.000 × 2 hs</span>
                      <span>$200.000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#0B0F12]/70">Tarifa de servicio</span>
                      <span>$3.000</span>
                    </div>
                    <div className="h-px bg-[#E5E7EB]" />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>$203.000</span>
                    </div>
                  </div>
                  <button className="mt-3 w-full rounded-md bg-[#0B0F12] px-4 py-2 text-sm font-medium text-white hover:opacity-90">Reservar ahora</button>
                </div>
              </section>

              {/* Card: Política de cancelación */}
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="text-sm font-medium text-[#0B0F12]">Política de Cancelación</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#0B0F12]/80">
                  <li>Cancelación gratuita hasta 24h antes</li>
                  <li>50% de reembolso entre 24h–12h antes</li>
                  <li>Sin reembolso con menos de 12h</li>
                  <li>Reprogramación gratuita una vez</li>
                </ul>
              </section>
            </div>
          </aside>

        </div>{/* grid */}
      </div>{/* container */}
    </main>
  );
}

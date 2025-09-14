import Gallery from "@/components/studio/Gallery";
import { OwnerService, type Studio as ServiceStudio } from "@/services/studio.services";
import { roomsService } from "@/services/rooms.service";

// Tipos mínimos (opcionales) según lo que usa la UI
type RoomLite = {
  id: string;
  title?: string;        // o name
  priceHour?: number;    // o pricePerHour
  capacity?: number;
  features?: string[];
  images?: string[];
};

function Stars({ value }: { value: number }) {
  const filled = Math.round(value ?? 0);
  return (
    <div className="flex" aria-label={`Puntaje ${value ?? 0} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[#f5b50a] text-base leading-none">
          {i < filled ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { month: "long", year: "numeric" });
}

type PageProps = { params: { id: string } };

export default async function StudioDetailsPage({ params }: PageProps) {
  const { id } = params;

  // 1) Studio real
  const studio: ServiceStudio = await OwnerService.getStudioById(id);

  // 2) Rooms reales del estudio (endpoint tolera sin token)
  const apiRooms = await roomsService.getRoomsByStudioId({ studioId: id });
  // Normalización mínima a lo que usa la UI
  const rooms: RoomLite[] = apiRooms.map((r: any) => ({
    id: r.id,
    title: r.title ?? r.name,
    priceHour: r.priceHour ?? r.pricePerHour,
    capacity: r.capacity,
    features: Array.isArray(r.features) ? r.features : [],
    images: Array.isArray(r.images) ? r.images : [],
  }));

  // 3) Fotos: del estudio si existen; si no, de rooms; si no, placeholder
  const photos: string[] =
    (studio as any)?.photos ??
    rooms.flatMap((r) => r.images ?? []).slice(0, 8) ??
    ["/images/placeholders/studio-cover.jpg"];

  // Campos opcionales que la UI mostraba desde el mock
  const rating: number | undefined = (studio as any)?.rating;
  const location: string | undefined =
    (studio as any)?.location ?? (studio as any)?.city ?? (studio as any)?.address;
  const amenities: string[] = Array.isArray((studio as any)?.amenities) ? (studio as any).amenities : [];
  const reviews: Array<{ id: string; author: string; date: string; rating: number; comment: string }> =
    Array.isArray((studio as any)?.reviews) ? (studio as any).reviews : [];

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#0B0F12]">
      <div className="mx-auto max-w-[1216px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:[grid-template-columns:800px_384px] gap-6">

          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Galería */}
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <Gallery photos={photos} altBase={studio.name} />
            </section>

            {/* Tarjeta del estudio */}
            <section className="rounded-2xl border border-[#E5E7EB] bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[18px] leading-6 font-semibold">{studio.name}</h2>
                  <p className="mt-1 text-xs text-white/85">
                    {typeof rating === "number" ? <>⭐ {rating} · </> : null}
                    {location ?? "Ubicación no disponible"}
                  </p>
                </div>
                {/* Acciones (placeholders) */}
                <div className="flex items-center gap-2">
                  <button className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/15">Guardar</button>
                  <button className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] hover:bg-white/15">Compartir</button>
                  <button aria-label="Más" className="grid h-7 w-7 place-items-center rounded-md border border-white/20 bg-white/10 hover:bg-white/15">⋯</button>
                </div>
              </div>

              {studio.description && (
                <p className="mt-3 text-[12px] leading-relaxed text-white/90">{studio.description}</p>
              )}

              {!!amenities.length && (
                <>
                  <div className="my-3 h-px bg-white/10" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-medium text-white/90">Equipos y comodidades</span>
                    {amenities.map((a) => (
                      <span key={a} className="rounded-md border border-white/15 bg-white/10 px-2 py-[3px] text-[11px]">{a}</span>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Salas disponibles */}
            <section className="rounded-2xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 text-white">
              <h2 className="text-[18px] leading-6 font-semibold">Salas disponibles</h2>
              <div className="mt-3 space-y-3">
                {rooms.map((room) => (
                  <div key={room.id} className="rounded-xl border border-white/15 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-white">{room.title ?? "Sala"}</h3>
                        <p className="mt-1 text-xs text-white/80">
                          {room.capacity ? `Capacidad: ${room.capacity} · ` : ""}
                          {room.features?.slice(0, 3).join(" · ")}
                        </p>
                        {!!room.features?.length && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {room.features.slice(0, 3).map((t) => (
                              <span key={t} className="rounded-md border border-white/15 bg-white/10 px-2 py-[3px] text-[11px] text-white/90">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          {typeof room.priceHour === "number" ? (
                            <>
                              ${" "}{room.priceHour.toLocaleString("es-AR")}
                              <span className="text-xs font-normal text-white/70">/ hora</span>
                            </>
                          ) : (
                            <span className="text-xs text-white/70">Consultar precio</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15">Ver detalles</button>
                          <button className="rounded-md bg-white px-3 py-1.5 text-xs text-[#0B0F12] hover:opacity-90">Reservar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!rooms.length && (
                  <p className="text-sm text-white/80">Este estudio aún no tiene salas publicadas.</p>
                )}
              </div>
            </section>

            {/* Ubicación */}
            <section className="rounded-2xl border border-white/20 bg-gradient-to-b from-[#036D9D] to-[#0B0F12] p-4 text-white">
              <h2 className="text-[18px] leading-6 font-semibold">Ubicación</h2>
              <div className="mt-3 mx-auto w-full lg:max-w-[800px]">
                <div className="relative w-full rounded-2xl overflow-hidden bg-white" style={{ aspectRatio: "800 / 418", minHeight: 418 }}>
                  <iframe
                    title={`Ubicación de ${studio.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      (studio as any)?.mapQuery ?? location ?? ""
                    )}&output=embed`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-white/80">{(studio as any)?.address ?? location ?? "Dirección no disponible"}</p>
            </section>

            {/* Reseñas (si existen) */}
            <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <h2 className="text-[18px] leading-6 font-semibold">Reseñas ({reviews.length})</h2>
              <ul className="mt-3 space-y-3">
                {reviews.slice(0, 2).map((rev) => (
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
              {reviews.length > 2 && <button className="mt-3 text-sm underline">Mostrar todas las reseñas</button>}
            </section>
          </div>

          {/* Columna derecha (resumen reserva) */}
          <aside>
            <div className="sticky top-20 space-y-4">
              <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[18px] font-semibold">$ 400.000<span className="text-sm font-normal"> /4hs</span></p>
                  <span className="text-xs text-[#0B0F12]/60">Mínimo 2 horas</span>
                </div>
                {/* … UI de reserva de ejemplo … */}
              </section>

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
        </div>
      </div>
    </main>
  );
}

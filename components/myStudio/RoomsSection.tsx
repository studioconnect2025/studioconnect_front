// components/myStudio/RoomsSection.tsx
type Room = {
  id: string;
  name: string;
  type?: string;
  sizeM2?: number;
  minHours?: number;
  pricePerHour?: number;
  image?: string;
  [k: string]: any;
};

function isImageLikeUrl(s: string) {
  if (typeof s !== "string") return false;
  if (s.startsWith("data:image/")) return true;
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i.test(s);
}

function firstRoomImage(r: any): string | undefined {
  const direct = [
    r?.image,
    r?.imageUrl,
    r?.cover,
    r?.coverPhoto,
    r?.photo,
    r?.photoUrl,
    r?.thumbnail,
    r?.thumb,
  ];
  for (const x of direct) if (isImageLikeUrl(x)) return x;

  const bagKeys = [
    "photos",
    "images",
    "gallery",
    "media",
    "pictures",
    "photoUrls",
    "imageUrls",
  ];
  for (const k of bagKeys) {
    const v = r?.[k];
    if (!Array.isArray(v)) continue;
    for (const it of v) {
      if (typeof it === "string" && isImageLikeUrl(it)) return it;
      const u = it?.url || it?.secure_url || it?.imageUrl || it?.src || it?.path;
      if (isImageLikeUrl(u)) return u;
    }
  }
  return undefined;
}

export default function RoomsSection({ rooms = [] }: { rooms: Room[] }) {
  if (!rooms.length) {
    return <div className="text-sm text-slate-600">Aún no hay salas cargadas.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rooms.map((room) => {
        const img = firstRoomImage(room);
        return (
          <div
            key={room.id ?? room.name}
            className="rounded-lg border border-slate-200 overflow-hidden bg-white"
          >
            <div className="relative h-36 bg-slate-100">
              {img ? (
                <img src={img} alt={room.name ?? "Sala"} className="h-full w-full object-cover" />
              ) : null}
            </div>

            <div className="p-3">
              <h4 className="font-medium text-slate-900">{room.name ?? "Sala"}</h4>
              <p className="mt-1 text-xs text-slate-600">
                {(room.type || "Tipo")} • {(room.sizeM2 ? `${room.sizeM2} m²` : "m²")} •{" "}
                {(room.minHours ? `Min. ${room.minHours} hs` : "Min. hs")} •{" "}
                {(room.pricePerHour ? `$${room.pricePerHour}/hora` : "$/hora")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

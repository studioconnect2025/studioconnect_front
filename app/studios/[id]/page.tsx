import StudioDetailsClient from "@/components/studiodetalle/studioDetalle";
import {
    OwnerService,
    type Studio as ServiceStudio,
} from "@/services/studio.services";
import { roomsService } from "@/services/rooms.service";

// Tipos mínimos para las salas
type RoomLite = {
    id: string;
    title?: string;
    priceHour?: number;
    capacity?: number;
    features?: string[];
    images?: string[];
};

export default async function StudioDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const studio: ServiceStudio = await OwnerService.getStudioById(id);
    const apiRooms = await roomsService.getRoomsByStudioId({ studioId: id });

    const rooms: RoomLite[] = apiRooms.map((r: any) => ({
        id: r.id,
        title: r.title ?? r.name,
        priceHour: r.priceHour ?? r.pricePerHour,
        capacity: r.capacity,
        features: Array.isArray(r.features) ? r.features : [],
        images: Array.isArray(r.images) ? r.images : [],
    }));

    return <StudioDetailsClient studio={studio} apiRooms={rooms} />;
}

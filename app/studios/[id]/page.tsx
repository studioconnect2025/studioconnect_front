import StudioDetailsClient from "@/components/studiodetalle/studioDetalle";
import { OwnerService, type Studio as ServiceStudio } from "@/services/studio.services";
import { roomsService } from "@/services/rooms.service";

interface StudioDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function StudioDetailsPage({ params }: StudioDetailsPageProps) {
  const { id } = params;

  const studio: ServiceStudio = await OwnerService.getStudioById(id);
  const apiRooms = await roomsService.getRoomsByStudioId({ studioId: id });

  return <StudioDetailsClient studio={studio} apiRooms={apiRooms} />;
}

export interface Availability {
    [day: string]: {
        start: string;
        end: string;
    };
}

export interface Instrument {
    id: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
    categoryName: string;
    roomId: string;
     room?: Room;
}

export interface Room {
    id: string;
    name: string;
    type: string;
    capacity: number;
    pricePerHour: string;
    size?: number;
    minHours: number;
    description: string;
    features: string[];
    customEquipment?: string;
    availability?: Availability;
    imageUrls?: string[] | null;
    imagePublicIds?: string[] | null;
    isActive?: boolean;
    instruments?: Instrument[];
    
}

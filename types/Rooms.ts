export interface Availability {
  [day: string]: {
    start: string;
    end: string;
  };
}

export interface Room {
  name: string;
  type: string;
  capacity: number;
  size: number;
  pricePerHour: number;
  minHours: number;
  description: string;
  features: string[];
  customEquipment?: string;
  availability?: Availability;
}

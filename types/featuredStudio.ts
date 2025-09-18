export type FeaturedStudio = {
  id: string;
  name: string;
  description?: string;

  // Opcionales (pueden venir del back en el futuro)
  location?: string;
  rating?: number;
  photos?: string[];
  amenities?: string[];
  pricePerHour?: number;
  

  createdAt?: string; // por si el back lo expone
};

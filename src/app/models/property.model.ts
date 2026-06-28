export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: 'Independent House' | 'Villa' | 'Apartment' | 'Commercial' | 'Plot' | 'Farm Land';
  price: number;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  areaSqYards: number;
  builtupSqFt: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  floors: number;
  facing: string;
  status: 'Available' | 'Sold' | 'Under Construction';
  featured: boolean;
  images: string[];
  video: string;
  amenities: string[];
  createdDate: string;
}
export interface Agent {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  propertyType: "House" | "Apartment" | "Condo";
  status: "For Sale" | "For Rent";
  isAvailable: boolean;
  images: string[];
  agent: Agent;
  createdAt: string;
  updatedAt: string;
}

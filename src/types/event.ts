export interface EventImage {
  id: string;
  url: string;
  alt: string;
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  venueDetails?: string;
}

export interface EventContact {
  name: string;
  email: string;
  phone?: string;
}

export interface EventTicket {
  id: string;
  name: string;
  price: number;
  availableQuantity: number;
  maxPerOrder?: number;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  startTime: string; // 24h format: HH:MM
  endTime: string; // 24h format: HH:MM
  location: EventLocation;
  images: EventImage[];
  featuredImage?: EventImage;
  category: string;
  tags: string[];
  status: EventStatus;
  isPublic: boolean;
  isFeatured: boolean;
  capacity?: number;
  contact: EventContact;
  tickets?: EventTicket[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type EventFormData = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'slug'>;

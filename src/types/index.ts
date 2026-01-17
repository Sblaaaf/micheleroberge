// Type de base - Record PocketBase
export interface PocketBaseRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

export interface Artwork extends PocketBaseRecord {
  title: string;
  collection: string;
  description: string;
  width: number;
  height: number;
  depth: number;
  price: number;
  images: string[];
  category: 'Divers'; 
  status: 'available' | 'reserved' | 'sold' | 'archived';
  stock: number;
  featured: boolean;
}

export interface News extends PocketBaseRecord {
  title: string;
  content: string;
  image: string;
  location: string;
  date_start: string;
  date_end: string;
}
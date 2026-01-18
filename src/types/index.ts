export interface PocketBaseRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
}

export interface Collection extends PocketBaseRecord {
  title: string;
  description?: string;
}

export interface Artwork extends PocketBaseRecord {
  title: string;
  description: string;
  price: number;
  width: number;
  height: number;
  depth: number;
  category: string;
  status: 'available' | 'sold' | 'reserved';
  images: string[];
  collection: string;
  // ID du prix Stripe pour les paiements
  stripe_price_id?: string;

  // Relation
  expand?: {
    collection?: Collection;
  };
}

export interface News extends PocketBaseRecord {
  title: string;
  content: string;
  image: string;
  location: string;
  date_start: string;
  date_end?: string;
}

export interface Reservation extends PocketBaseRecord {
  artwork: string; 
  client_name: string;
  client_email: string;
  message: string;
  status: 'pending' | 'confirmed' | 'rejected';

  // Relation
  expand?: {
    artwork?: Artwork;
  };
}
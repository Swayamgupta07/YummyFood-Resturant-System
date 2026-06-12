export interface Review {
  _id?: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string | Date;
}

export interface Food {
  _id?: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  isVeg: boolean;
  active: boolean;
  freeDelivery: boolean;
  dateOfLaunch?: string | Date;
  rating?: number;
  reviews?: Review[];
}

export interface Food {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  active: boolean;
  dateOfLaunch: string | Date;
  freeDelivery: boolean;
}

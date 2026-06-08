import { Food } from './food';

export interface CartItem {
  id?: number;
  food: Food;
  quantity: number;
  price: number;
}

import { Food } from '../food/food';

export interface CartItem {
  food: Food;
  quantity: number;
}

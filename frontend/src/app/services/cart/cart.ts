import { Injectable, signal, computed } from '@angular/core';
import { Food } from '../../models/food/food';
import { CartItem } from '../../models/cart-item/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  items = this.cartItems.asReadonly();

  totalCount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.food.price * item.quantity, 0)
  );

  deliveryCharge = computed(() => {
    const items = this.cartItems();
    if (items.length === 0) return 0;
    return items.every((item) => item.food.freeDelivery) ? 0 : 50;
  });

  grandTotal = computed(() => this.totalPrice() + this.deliveryCharge());

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        this.cartItems.set(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  addToCart(food: Food, quantity = 1) {
    const items = [...this.cartItems()];
    const idx = items.findIndex((item) => item.food._id === food._id);
    if (idx > -1) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ food, quantity });
    }
    this.cartItems.set(items);
    this.saveCart();
  }

  removeFromCart(foodId: string) {
    this.cartItems.set(this.cartItems().filter((item) => item.food._id !== foodId));
    this.saveCart();
  }

  updateQuantity(foodId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(foodId);
      return;
    }
    this.cartItems.set(
      this.cartItems().map((item) =>
        item.food._id === foodId ? { ...item, quantity } : item
      )
    );
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }
}

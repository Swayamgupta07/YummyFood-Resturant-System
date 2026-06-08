import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Food } from '../models/food';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  // Read-only signals for easy template binding
  items = this.cartItems.asReadonly();

  totalCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.price, 0);
  });

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        this.cartItems.set(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart from storage', e);
      }
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  addToCart(food: Food, quantity = 1) {
    const items = [...this.cartItems()];
    const existingIndex = items.findIndex((item) => item.food.id === food.id);

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      items[existingIndex] = {
        ...existing,
        quantity: existing.quantity + quantity,
        price: food.price * (existing.quantity + quantity),
      };
    } else {
      items.push({
        food,
        quantity,
        price: food.price * quantity,
      });
    }

    this.cartItems.set(items);
    this.saveCart();
  }

  removeFromCart(foodId: number) {
    const items = this.cartItems().filter((item) => item.food.id !== foodId);
    this.cartItems.set(items);
    this.saveCart();
  }

  updateQuantity(foodId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(foodId);
      return;
    }

    const items = this.cartItems().map((item) => {
      if (item.food.id === foodId) {
        return {
          ...item,
          quantity,
          price: item.food.price * quantity,
        };
      }
      return item;
    });

    this.cartItems.set(items);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }
}

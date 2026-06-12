import { Component, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart/cart';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  items = computed(() => this.cartService.items());
  totalPrice = computed(() => this.cartService.totalPrice());
  totalCount = computed(() => this.cartService.totalCount());
  deliveryCharge = computed(() => this.cartService.deliveryCharge());
  grandTotal = computed(() => this.cartService.grandTotal());

  constructor(private cartService: CartService, private router: Router) {}

  updateQty(foodId: string, qty: number) {
    this.cartService.updateQuantity(foodId, qty);
  }

  remove(foodId: string) {
    this.cartService.removeFromCart(foodId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}

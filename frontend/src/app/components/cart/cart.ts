import { Component, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart/cart';
import { Navbar } from '../navbar/navbar';
import { ImageUrlPipe } from '../../pipes/image-url/image-url';
import { ToastService } from '../../services/toast/toast';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, Navbar, ImageUrlPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  items = computed(() => this.cartService.items());
  totalPrice = computed(() => this.cartService.totalPrice());
  totalCount = computed(() => this.cartService.totalCount());
  deliveryCharge = computed(() => this.cartService.deliveryCharge());
  grandTotal = computed(() => this.cartService.grandTotal());

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService
  ) {}

  updateQty(foodId: string, qty: number) {
    this.cartService.updateQuantity(foodId, qty);
  }

  remove(foodId: string) {
    this.cartService.removeFromCart(foodId);
    this.toastService.show('Item removed from cart!', 'info');
  }

  clearCart() {
    this.cartService.clearCart();
    this.toastService.show('Cart cleared!', 'info');
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}

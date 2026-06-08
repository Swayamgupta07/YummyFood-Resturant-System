import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    public auth: Auth,
    public cart: CartService,
    private router: Router,
  ) {}

  get user() {
    return this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
    this.cart.clearCart();
    this.router.navigate(['/login']);
  }
}

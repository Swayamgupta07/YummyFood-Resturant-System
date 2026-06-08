import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { Cart } from './components/cart/cart';
import { FoodDetails } from './components/food-details/food-details';
import { OrderHistory } from './components/order-history/order-history';
import { Checkout } from './components/checkout/checkout';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'cart', component: Cart },
  { path: 'food/:id', component: FoodDetails },
  { path: 'order-history', component: OrderHistory },
  { path: 'checkout', component: Checkout },
];

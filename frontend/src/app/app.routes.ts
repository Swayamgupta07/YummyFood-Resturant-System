import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';
import { Cart } from './components/cart/cart';
import { FoodDetails } from './components/food-details/food-details';
import { OrderHistory } from './components/order-history/order-history';
import { Checkout } from './components/checkout/checkout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AddFood } from './admin/add-food/add-food';
import { EditFood } from './admin/edit-food/edit-food';
import { FoodList } from './components/food-list/food-list';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home },
  { path: 'cart', component: Cart },
  { path: 'category/:name', component: FoodList },
  { path: 'food/:id', component: FoodDetails },
  { path: 'order-history', component: OrderHistory },
  { path: 'checkout', component: Checkout },
  { path: 'admin', component: AdminDashboard },
  { path: 'admin/add-food', component: AddFood },
  { path: 'admin/edit-food/:id', component: EditFood },
];

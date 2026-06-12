import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard/auth-guard';
import { adminGuard } from './guards/admin-guard/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./components/register/register').then(m => m.Register) },
  { path: 'home', loadComponent: () => import('./components/home/home').then(m => m.Home) },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () => import('./components/cart/cart').then(m => m.Cart)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./components/checkout/checkout').then(m => m.Checkout)
  },
  {
    path: 'order-history',
    canActivate: [authGuard],
    loadComponent: () => import('./components/order-history/order-history').then(m => m.OrderHistory)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
  },
  {
    path: 'admin/add-food',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./admin/add-food/add-food').then(m => m.AddFood)
  },
  {
    path: 'admin/edit-food/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./admin/edit-food/edit-food').then(m => m.EditFood)
  },
  { path: 'food/:id', loadComponent: () => import('./components/food-details/food-details').then(m => m.FoodDetails) },
  { path: 'category/:name', loadComponent: () => import('./components/food-list/food-list').then(m => m.FoodList) },
  { path: '**', redirectTo: 'home' },
];

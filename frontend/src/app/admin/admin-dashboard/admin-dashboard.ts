import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { OrderService } from '../../services/order/order';
import { FoodService } from '../../services/food/food';
import { Food } from '../../models/food/food';
import { Order } from '../../models/order/order';
import { Navbar } from '../../components/navbar/navbar';
import { ORDER_STATUSES } from '../../constants/constants';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, Navbar, DecimalPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  stats: any = null;
  orders: Order[] = [];
  foods: Food[] = [];
  isLoadingStats = true;
  isLoadingOrders = true;
  isLoadingFoods = true;
  activeTab: 'orders' | 'foods' = 'orders';

  statusOptions = ORDER_STATUSES;

  constructor(
    private orderService: OrderService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadOrders();
    this.loadFoods();
  }

  loadStats() {
    this.orderService.getDashboardStats().subscribe({
      next: (data: any) => { this.stats = data; this.isLoadingStats = false; },
      error: () => { this.isLoadingStats = false; },
    });
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (orders: Order[]) => { this.orders = orders; this.isLoadingOrders = false; },
      error: () => { this.isLoadingOrders = false; },
    });
  }

  loadFoods() {
    this.foodService.getFoods().subscribe({
      next: (foods: Food[]) => { this.foods = foods; this.isLoadingFoods = false; },
      error: () => { this.isLoadingFoods = false; },
    });
  }

  updateStatus(orderId: string, status: string) {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: (updated: Order) => {
        const idx = this.orders.findIndex((o) => o._id === orderId);
        if (idx > -1) this.orders[idx] = updated;
        this.loadStats();
      },
    });
  }

  updatePaymentStatus(orderId: string, paymentStatus: string) {
    this.orderService.updateOrderStatus(orderId, undefined, paymentStatus).subscribe({
      next: (updated: Order) => {
        const idx = this.orders.findIndex((o) => o._id === orderId);
        if (idx > -1) this.orders[idx] = updated;
        this.loadStats();
      },
    });
  }

  deleteFood(id: string) {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    this.foodService.deleteFood(id).subscribe({
      next: () => { this.foods = this.foods.filter((f) => f._id !== id); },
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PLACED: 'badge-placed', PREPARING: 'badge-preparing',
      OUT_FOR_DELIVERY: 'badge-delivery', DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled',
    };
    return map[status] || 'badge-placed';
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

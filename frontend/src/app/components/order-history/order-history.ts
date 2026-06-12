import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order';
import { Order } from '../../models/order/order';
import { Navbar } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { ImageUrlPipe } from '../../pipes/image-url/image-url';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [Navbar, RouterLink, ImageUrlPipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PLACED: 'badge-placed',
      PREPARING: 'badge-preparing',
      OUT_FOR_DELIVERY: 'badge-delivery',
      DELIVERED: 'badge-delivered',
      CANCELLED: 'badge-cancelled',
    };
    return map[status] || 'badge-placed';
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
}

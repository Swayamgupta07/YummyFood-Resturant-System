import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../../models/order/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  placeOrder(orderData: object): Observable<Order> {
    return this.http.post(this.apiUrl, orderData).pipe(
      map((res: any) => res.data.order as Order)
    );
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get(`${this.apiUrl}/my-orders`).pipe(
      map((res: any) => res.data.orders as Order[])
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get(this.apiUrl).pipe(
      map((res: any) => res.data.orders as Order[])
    );
  }

  updateOrderStatus(id: string, orderStatus?: string, paymentStatus?: string): Observable<Order> {
    const body: any = {};
    if (orderStatus) body.orderStatus = orderStatus;
    if (paymentStatus) body.paymentStatus = paymentStatus;
    return this.http.patch(`${this.apiUrl}/${id}/status`, body).pipe(
      map((res: any) => res.data.order as Order)
    );
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard-stats`).pipe(
      map((res: any) => res.data)
    );
  }
}

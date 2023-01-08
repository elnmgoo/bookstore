import {Injectable} from '@angular/core';
import {Order} from '../models/order';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OrderService {
  orders: Order[] = [];
  ordersUrl = environment.apiUrl + '/orders';

  constructor(private httpClient: HttpClient) { }


  addOrder(order: Order): Observable<Order> {
    const newOrder = {...order};
    newOrder.id = Date.now();
    this.orders = [...this.orders, newOrder];
    return of(newOrder);
  }

  getOrders(): Observable<Order[]> {
    return of(this.orders);
  }

  deleteOrder(anOrder: Order): Observable<Order> {
    this.orders = [...this.orders.filter(order => order.id !== anOrder.id)];
    return of(anOrder);
  }


  deleteOrderByIndex(index: number): Observable<number> {
    this.orders = [...this.orders.slice(0, index), ...this.orders.slice(index + 1)];
    return of(index);
  }

  bookOrder(order: Order): Observable<Order> {
    return this.httpClient.put<Order>(this.ordersUrl + '/addOrder', order);
  }
}

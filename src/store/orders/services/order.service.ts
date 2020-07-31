import {Injectable} from '@angular/core';
import {Order} from '../models/order';
import {Observable, of} from 'rxjs';

@Injectable()
export class OrderService {
  orders: Order[] = [];


  addOrder(order: Order): Observable<Order> {
    console.log('add ' + order.description);
    const newOrder = {...order};
    newOrder.id = Date.now();
    this.orders = [...this.orders, newOrder];
    console.log('add length: ' + this.orders.length);
    return of(newOrder);
  }

  getOrders(): Observable<Order[]> {
    console.log('get length: ' + this.orders.length);
    return of(this.orders);
  }

  deleteOrder(anOrder: Order): Observable<Order> {
    console.log('del length: ' + this.orders.length);
    this.orders = [...this.orders.filter(order => order.id !== anOrder.id)];
    console.log('del length: ' + this.orders.length);
    return of(anOrder);
  }


  deleteOrderByIndex(index: number): Observable<number> {
    console.log('del length: ' + this.orders.length);
    this.orders = [...this.orders.slice(0, index), ...this.orders.slice(index + 1)];
    console.log('del length: ' + this.orders.length);
    return of(index);
  }


}

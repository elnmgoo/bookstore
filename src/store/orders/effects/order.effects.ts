import {Injectable, OnInit} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, filter, take, switchMap} from 'rxjs/operators';
import {Order} from '../models/order';
import {
  AddOrder,
  AddOrderSuccess, BookOrder, BookOrderSuccess, DeleteAllOrder,
  DeleteOrder,
  DeleteOrderSuccess,
  EOrderActions,
  GetOrdersSuccess,
  OrderError
} from '../actions/order.actions';
import {OrderService} from '../services/order.service';
import {Discount} from '../models/discount';


@Injectable()
export class OrderEffects {

  constructor(private action$: Actions, private orderService: OrderService) {
  }


  GetOrders$ = createEffect(() => this.action$.pipe(
    ofType(EOrderActions.GetOrders),
    /*filter(() => AppConstants.getOrdersCounter++ === 0), werkt ook echter take(1) is eenvoudiger*/
    take(1),
    mergeMap((action) =>
      this.orderService.getOrders().pipe(
        map((data: Order[]) => {
          return new GetOrdersSuccess(data);
        }),
        catchError((error: Error) => {
          return of(new OrderError(error));
        })
      )
    )
  ));


  AddOrders$ = createEffect(() => this.action$.pipe(
    ofType<AddOrder>(EOrderActions.AddOrder),
    mergeMap(action =>
      this.orderService.addOrder(action.payload)
        .pipe(
          map((data: Order) => {
            return new AddOrderSuccess(data);
          }),
          catchError((error: Error) => {
            return of(new OrderError(error));
          })
        )
    )
  ));


  DeleteOrders$ = createEffect(() => this.action$.pipe(
    ofType<DeleteOrder>(EOrderActions.DeleteOrder),
    mergeMap(action =>
      this.orderService.deleteOrder(action.payload)
        .pipe(
          map((order: Order) => {
            return new DeleteOrderSuccess(order);
          }),
          catchError((error: Error) => {
            return of(new OrderError(error));
          })
        )
    )
  ));


  BookOrder$ = createEffect(() => this.action$.pipe(
    ofType<BookOrder>(EOrderActions.BookOrder),
    mergeMap(action =>
      this.orderService.bookOrder(action.payload)
        .pipe(
          map((data: Order) => {
            return new BookOrderSuccess(data);
          }),
          catchError((error: Error) => {
            return of(new OrderError(error));
          })
        )
    )
  ));


}

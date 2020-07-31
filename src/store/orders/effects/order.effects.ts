import {Injectable, OnInit} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, filter, take} from 'rxjs/operators';
import {Order} from '../models/order';
import {
  AddOrder,
  AddOrderSuccess,
  DeleteOrder,
  DeleteOrderSuccess,
  EOrderActions,
  GetOrdersSuccess,
  OrderError
} from '../actions/order.actions';
import {OrderService} from '../services/order.service';
import {AppConstants} from '../../../app/app-constants';

@Injectable()
export class OrderEffects {

  constructor(private action$: Actions, private orderService: OrderService) {
  }

  @Effect()
  GetOrders$ = this.action$.pipe(
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
  );

  @Effect()
  AddOrders$ = this.action$.pipe(
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
  );

  @Effect()
  DeleteOrders$ = this.action$.pipe(
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
  );

}

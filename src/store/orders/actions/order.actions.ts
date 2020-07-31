import {Action, createAction, props} from '@ngrx/store';
import {Order} from '../models/order';

export enum EOrderActions {
  GetOrders = '[Order] - Get Orders',
  GetOrdersSuccess = '[Order] - Get OrdersSuccess',
  AddOrder = '[Order] - Add order',
  AddOrderSuccess = '[Order] - Add order success',
  DeleteOrder = '[Order] - Delete order',
  DeleteOrderSuccess = '[Order] - Delete order success',
  OrderError = '[Order] - Error'
}

export class GetOrders implements Action {
  public readonly type = EOrderActions.GetOrders;
}

export class GetOrdersSuccess implements Action {
  public readonly type = EOrderActions.GetOrdersSuccess;
  constructor(public payload: Order[]) {}
}

export class AddOrder implements Action {
  public readonly type = EOrderActions.AddOrder;
  constructor(public payload: Order) {}
}

export class AddOrderSuccess implements Action {
  public readonly type = EOrderActions.AddOrderSuccess;
  constructor(public payload: Order) {}
}

export class DeleteOrder implements Action {
  public readonly type = EOrderActions.DeleteOrder;
  constructor(public payload: Order) {}
}

export class DeleteOrderSuccess implements Action {
  public readonly type = EOrderActions.DeleteOrderSuccess;
  constructor(public payload: Order) {}
}


export class OrderError implements Action {
  public readonly type = EOrderActions.OrderError;
  constructor(public error: Error) {}
}

export type OrderActions = GetOrders | GetOrdersSuccess | AddOrder | AddOrderSuccess | DeleteOrder | DeleteOrderSuccess| OrderError;

import {Action, createAction, props} from '@ngrx/store';
import {Order} from '../models/order';
import {Discount} from '../models/discount';

export enum EOrderActions {
  GetOrders = '[Order] - Get Orders',
  GetOrdersSuccess = '[Order] - Get OrdersSuccess',
  AddOrder = '[Order] - Add order',
  AddOrderSuccess = '[Order] - Add order success',
  DeleteOrder = '[Order] - Delete order',
  DeleteOrderSuccess = '[Order] - Delete order success',
  BookOrder = '[Order] - Book order',
  BookOrderSuccess = '[Order] - Book order success',
  DeleteAllOrder = '[Order] - DeleteAll order',
  SetDiscount = '[Order] - SetDiscount',
  SetDiscountSuccess = '[Order] - SetDiscount success',
  OrderError = '[Order] - Error',
  ConfirmOrders = '[Orders] Confirm',
  ConfirmOrdersSuccess = '[Orders] Confirm success',
}

export class GetOrders implements Action {
  public readonly type = EOrderActions.GetOrders;
}

export class GetOrdersSuccess implements Action {
  public readonly type = EOrderActions.GetOrdersSuccess;

  constructor(public payload: Order[]) {
  }
}

export class AddOrder implements Action {
  public readonly type = EOrderActions.AddOrder;

  constructor(public payload: Order) {
  }
}

export class ConfirmOrders implements Action {
  public readonly type = EOrderActions.ConfirmOrders;
}

export class ConfirmOrdersSuccess implements Action {
  public readonly type = EOrderActions.ConfirmOrdersSuccess;
}

export class AddOrderSuccess implements Action {
  public readonly type = EOrderActions.AddOrderSuccess;

  constructor(public payload: Order) {
  }
}

export class DeleteOrder implements Action {
  public readonly type = EOrderActions.DeleteOrder;

  constructor(public payload: Order) {
  }
}

export class DeleteOrderSuccess implements Action {
  public readonly type = EOrderActions.DeleteOrderSuccess;

  constructor(public payload: Order) {
  }
}

export class DeleteAllOrder implements Action {
  public readonly type = EOrderActions.DeleteAllOrder;

  constructor() {
  }
}

export class BookOrder implements Action {
  public readonly type = EOrderActions.BookOrder;

  constructor(public payload: Order) {
  }
}

export class BookOrderSuccess implements Action {
  public readonly type = EOrderActions.BookOrderSuccess;

  constructor(public payload: Order) {
  }
}

export class SetDiscount implements Action {
  public readonly type = EOrderActions.SetDiscount;

  constructor(public payload: Discount) {
  }
}

export class OrderError implements Action {
  public readonly type = EOrderActions.OrderError;

  constructor(public error: Error) {
  }
}


export type OrderActions =
  GetOrders
  | GetOrdersSuccess
  | AddOrder
  | AddOrderSuccess
  | DeleteOrder
  | DeleteOrderSuccess
  | BookOrder
  | DeleteAllOrder
  | BookOrderSuccess
  | SetDiscount
  | OrderError;

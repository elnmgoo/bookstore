import {Action, createAction, props} from '@ngrx/store';
import {Item} from '../models/item';

export enum EItemActions {
  GetItems = '[Item] - Get Items',
  GetItemsSuccess = '[Item] - Get ItemsSuccess',
  AddItem = '[Item] - Add item',
  AddItemSuccess = '[Item] - Add item success',
  DeleteItem = '[Item] - Delete item',
  DeleteItemSuccess = '[Item] - Delete item success',
  ItemError = '[Item] - Error'
}

export class GetItems implements Action {
  public readonly type = EItemActions.GetItems;
}

export class GetItemsSuccess implements Action {
  public readonly type = EItemActions.GetItemsSuccess;
  constructor(public payload: Item[]) {}
}

export class AddItem implements Action {
  public readonly type = EItemActions.AddItem;
  constructor(public payload: Item) {}
}

export class AddItemSuccess implements Action {
  public readonly type = EItemActions.AddItemSuccess;
  constructor(public payload: Item) {}
}

export class DeleteItem implements Action {
  public readonly type = EItemActions.DeleteItem;
  constructor(public payload: Item) {}
}

export class DeleteItemSuccess implements Action {
  public readonly type = EItemActions.DeleteItemSuccess;
  constructor(public payload: Item) {}
}


export class ItemError implements Action {
  public readonly type = EItemActions.ItemError;
  constructor(public error: Error) {}
}

export type ItemActions = GetItems | GetItemsSuccess | AddItem | AddItemSuccess | DeleteItem | DeleteItemSuccess| ItemError;

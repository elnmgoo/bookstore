import { Action, createReducer, on } from '@ngrx/store';
import * as ItemActions from '../actions/item.actions';
import Item from '../models/item';
import ItemState, { initializeState } from './index';

export const intialState = initializeState();

const reducer = createReducer(
  intialState,
  on(ItemActions.GetItemAction, state => state),
  on(ItemActions.AddItemAction, state => state),
  on(ItemActions.GetItemActionSuccess, (state: ItemState, { payload }) => {
    return { ...state, Items: payload };
  }),
  on(ItemActions.AddItemActionSuccess, (state: ItemState, { payload }) => {
    return { ...state, Items: [...state.Items, payload], ItemError: null };
  }),
  on(ItemActions.ItemActionError, (state: ItemState, error: Error) => {
    console.log(error);
    return { ...state, ItemError: error };
  })
);

export function ItemReducer(state: ItemState | undefined, action: Action) {
  return reducer(state, action);
}

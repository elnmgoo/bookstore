import { ItemState, initialItemState } from './items/state/item.state';
import {initialOrderState, OrderState} from './orders/state/order.state';
/* import { initialConfigState, IConfigState } from './config.state';*/


export interface AppState {
  items: ItemState;
  orders: OrderState;
  /* config: IConfigState;*/
}

export const initialAppState: AppState = {
  items: initialItemState,
  orders: initialOrderState
  /* config: initialConfigState */
};

export function getInitialState(): AppState {
  return initialAppState;
}

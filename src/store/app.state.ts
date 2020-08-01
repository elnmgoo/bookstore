import { ItemState, initialItemState } from './items/state/item.state';
import {initialOrderState, OrderState} from './orders/state/order.state';
import {initialPublisherState, PublisherState} from './publishers/state/publisher.state';
/* import { initialConfigState, IConfigState } from './config.state';*/


export interface AppState {
  items: ItemState;
  orders: OrderState;
  publishers: PublisherState;
  /* config: IConfigState;*/
}

export const initialAppState: AppState = {
  items: initialItemState,
  orders: initialOrderState,
  publishers: initialPublisherState
  /* config: initialConfigState */
};

export function getInitialState(): AppState {
  return initialAppState;
}

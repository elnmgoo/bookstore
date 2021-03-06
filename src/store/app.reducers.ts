import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { itemReducers } from './items/reducers/item.reducers';
import {orderReducers} from './orders/reducers/order.reducers';
import {publisherReducers} from './publishers/reducers/publisher.reducers';

export const appReducers: ActionReducerMap<AppState, any> = {

  items: itemReducers,
  orders: orderReducers,
  publishers: publisherReducers
  /*config: configReducers*/
};

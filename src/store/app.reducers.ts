import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { AppState } from './app.state';
/*import { configReducers } from './config.reducers';*/
import { itemReducers } from './items/reducers/item.reducers';

export const appReducers: ActionReducerMap<AppState, any> = {
  router: routerReducer,
  items: itemReducers
  /*config: configReducers*/
};

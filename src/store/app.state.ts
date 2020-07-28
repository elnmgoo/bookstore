import { RouterReducerState } from '@ngrx/router-store';

import { ItemState, initialItemState } from './items/state/item.state';
/* import { initialConfigState, IConfigState } from './config.state';*/


export interface AppState {
  router?: RouterReducerState;
  items: ItemState;
  /* config: IConfigState;*/
}

export const initialAppState: AppState = {
  items: initialItemState,
  /* config: initialConfigState */
};

export function getInitialState(): AppState {
  return initialAppState;
}

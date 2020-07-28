import { createSelector } from '@ngrx/store';

import { AppState } from '../../app.state';
import { ItemState } from '../state/item.state';

const selectItems = (state: AppState) => state.items;

export const selectItemList = createSelector(
  selectItems,
  (state: ItemState) => state.items
);

export const itemError = createSelector(
  selectItems,
  (state: ItemState) => state.itemError
);


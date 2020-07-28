import {Item} from '../models/item';

export interface ItemState {
  items: Array<Item>;
  itemError: Error;
}

export const initialItemState: ItemState = {
   items: Array<Item>(),
   itemError: null,
 };

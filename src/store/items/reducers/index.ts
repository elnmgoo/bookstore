import Item from '../models/item';

export default class ItemState {
  Items: Array<Item>;
  ItemError: Error;
}

export const initializeState = (): ItemState => {
  return { Items: Array<Item>(), ItemError: null };
};

import { createAction, props } from '@ngrx/store';
import Item from '../models/item';


export const GetItemAction = createAction('[Item] - Start Get Item');
export const GetItemActionSuccess = createAction('[Item] - Get item success', props<{ payload: Item[] }>());


export const AddItemAction = createAction('[Item] - Add item', props<{ payload: Item }>());
export const AddItemActionSuccess = createAction('[Item] - Add item success', props<{ payload: Item }>());

export const ItemActionError = createAction('[Item] - Error', props<Error>());


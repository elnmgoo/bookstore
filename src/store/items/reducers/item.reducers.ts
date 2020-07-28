import {initialItemState, ItemState} from '../state/item.state';
import {EItemActions, ItemActions} from '../actions/item.actions';

export const itemReducers = (
  state = initialItemState,
  action: ItemActions
): ItemState => {
  switch (action.type) {
    case EItemActions.GetItemsSuccess: {
      return {...state, items: action.payload};
    }
    case EItemActions.AddItemSuccess: {
      return {...state, items: [...state.items, action.payload]};
    }
    case EItemActions.DeleteItemSuccess: {
      return {...state, items: state.items.filter(item => item.id !== action.payload.id)};
    }
    case EItemActions.ItemError: {
      console.log(action.error);
      return state;
    }
    default: {
      return state;
    }
  }
};

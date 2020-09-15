import {initialOrderState, OrderState} from '../state/order.state';
import {EOrderActions, OrderActions} from '../actions/order.actions';

export const orderReducers = (
  state = initialOrderState,
  action: OrderActions
): OrderState => {
  switch (action.type) {
    case EOrderActions.GetOrdersSuccess: {
      return {...state, orders: action.payload};
    }
    case EOrderActions.AddOrderSuccess: {
      /* const newPriceTotalTaxMap: Map<number, number> = { ...state.priceTotalTaxMap};*/
      if (state.priceTotalTaxMap.has(action.payload.tax)) {
        state.priceTotalTaxMap.set(action.payload.tax,
          state.priceTotalTaxMap.get(action.payload.tax) + (action.payload.price * action.payload.amount));
      } else {
        state.priceTotalTaxMap.set(action.payload.tax, (action.payload.price * action.payload.amount));
      }
      return {
        ...state, orders: [...state.orders, action.payload], priceTotal: state.priceTotal + (action.payload.price * action.payload.amount) ,
        priceTotalTaxMap: state.priceTotalTaxMap
      };
    }
    case EOrderActions.DeleteOrderSuccess: {
      if (state.priceTotalTaxMap.has(action.payload.tax)) {
        state.priceTotalTaxMap.set(action.payload.tax,
          state.priceTotalTaxMap.get(action.payload.tax) - (action.payload.price * action.payload.amount));
      } else {
        state.priceTotalTaxMap.set(action.payload.tax, 0);
      }
      return {
        ...state,
        orders: [...state.orders.filter(order => order.id !== action.payload.id)],
        priceTotal: state.priceTotal - (action.payload.price * action.payload.amount),
        priceTotalTaxMap: state.priceTotalTaxMap
      };
    }
    case EOrderActions.OrderError: {
      console.log(action.error);
      return state;
    }
    case EOrderActions.BookOrderSuccess:
    default: {
      return state;
    }
  }
};

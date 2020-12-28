import {initialOrderState, OrderState} from '../state/order.state';
import {EOrderActions, OrderActions} from '../actions/order.actions';
import {Order} from '../models/order';

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
          state.priceTotalTaxMap.get(action.payload.tax) + (action.payload.total));
      } else {
        state.priceTotalTaxMap.set(action.payload.tax, (action.payload.total));
      }
      return {
        ...state, orders: [...state.orders, action.payload], priceTotal: state.priceTotal + (action.payload.total) ,
        priceTotalTaxMap: state.priceTotalTaxMap
      };
    }
    case EOrderActions.DeleteOrderSuccess: {
      if (state.priceTotalTaxMap.has(action.payload.tax)) {
        state.priceTotalTaxMap.set(action.payload.tax,
          state.priceTotalTaxMap.get(action.payload.tax) - (action.payload.total));
      } else {
        state.priceTotalTaxMap.set(action.payload.tax, 0);
      }
      return {
        ...state,
        orders: [...state.orders.filter(order => order.id !== action.payload.id)],
        priceTotal: state.priceTotal - (action.payload.total),
        priceTotalTaxMap: state.priceTotalTaxMap
      };
    }
    case EOrderActions.DeleteAllOrder: {
      return {
        ...state,
        orders: Array<Order>(),
        orderIdCounter: 0,
        priceTotal: 0,
        priceTotalTaxMap: new Map<number, number>(),
        orderError: null
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

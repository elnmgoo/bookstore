import {initialOrderState, OrderState} from '../state/order.state';
import {EOrderActions, OrderActions} from '../actions/order.actions';
import {Order} from '../models/order';
import {Discount} from '../models/discount';
import {formatDate} from "@angular/common";

export const orderReducers = (
  state = initialOrderState,
  action: OrderActions
): OrderState => {
  switch (action.type) {
    case EOrderActions.GetOrdersSuccess: {
      return {...state, orders: action.payload};
    }
    case EOrderActions.AddOrderSuccess: {
      if (state.priceTotalTaxMap.has(action.payload.tax)) {
        state.priceTotalTaxMap.set(action.payload.tax,
          state.priceTotalTaxMap.get(action.payload.tax) + (action.payload.total));
      } else {
        state.priceTotalTaxMap.set(action.payload.tax, (action.payload.total));
      }
      const price = state.priceTotal + (action.payload.total);
      return {
        ...state, orders: [...state.orders, action.payload],
        priceTotal: price,
        priceTotalTaxMap: state.priceTotalTaxMap,
        discountPercentageValue: calculateDiscountPercentageValue(state.discount, price),
        priceTotalWithDiscount: calculateTotalWithDiscount(state.discount, price),
        priceTotalWithDiscountAndReduction: calculateTotalWithDiscountWithReduction(state.discount, price),
        priceTotalTaxMapWithDiscount: calculateTotalTaxWithDiscount(state.discount, state.priceTotalTaxMap),
        transactionRef: state.transactionRef === '' ? formatDate(Date.now(), 'yyyyMMddhhmmss', 'nl-NL') : state.transactionRef,
        totalAmount: state.totalAmount + action.payload.amount
      };
    }
    case EOrderActions.DeleteOrderSuccess: {
      if (state.priceTotalTaxMap.has(action.payload.tax)) {
        state.priceTotalTaxMap.set(action.payload.tax,
          state.priceTotalTaxMap.get(action.payload.tax) - (action.payload.total));
      } else {
        state.priceTotalTaxMap.set(action.payload.tax, 0);
      }
      const price = state.priceTotal - (action.payload.total);
      return {
        ...state,
        orders: [...state.orders.filter(order => order.id !== action.payload.id)],
        priceTotal: price,
        priceTotalTaxMap: state.priceTotalTaxMap,
        discountPercentageValue: calculateDiscountPercentageValue(state.discount, price),
        priceTotalWithDiscount: calculateTotalWithDiscount(state.discount, price),
        priceTotalWithDiscountAndReduction: calculateTotalWithDiscountWithReduction(state.discount, price),
        priceTotalTaxMapWithDiscount: calculateTotalTaxWithDiscount(state.discount, state.priceTotalTaxMap),
        totalAmount: state.totalAmount - action.payload.amount
      };
    }
    case EOrderActions.DeleteAllOrder: {
      return {
        ...state,
        discount: {
          discountValue: 0,
          discountText: 'Af',
          discountPercentageText: 'Korting',
          discountPercentage: 0
        },
        orders: Array<Order>(),
        orderIdCounter: 0,
        discountPercentageValue: 0,
        priceTotal: 0,
        priceTotalTaxMap: new Map<number, number>(),
        priceTotalTaxMapWithDiscount: new Map<number, number>(),
        priceTotalWithDiscount: 0,
        priceTotalWithDiscountAndReduction: 0,
        orderError: null,
        totalAmount: 0
      };
    }
    case EOrderActions.SetDiscount: {
      return {
        ...state,
        discountPercentageValue: calculateDiscountPercentageValue(action.payload, state.priceTotal),
        priceTotalWithDiscount: calculateTotalWithDiscount(action.payload, state.priceTotal),
        priceTotalWithDiscountAndReduction: calculateTotalWithDiscountWithReduction(action.payload, state.priceTotal),
        discount: action.payload,
        priceTotalTaxMapWithDiscount: calculateTotalTaxWithDiscount(action.payload, state.priceTotalTaxMap)
      };
    }
    case EOrderActions.OrderError: {
      return state;
    }

    case EOrderActions.BookOrderSuccess:
    default: {
      return state;
    }
  }

  function calculateDiscountPercentageValue(discount: Discount, total: number) {
    return Math.round(total * (discount.discountPercentage) / 100.0);
  }

  function calculateTotalWithDiscount(discount: Discount, total: number) {
    return Math.round(total - calculateDiscountPercentageValue(discount, total));
  }

  function calculateTotalWithDiscountWithReduction(discount: Discount, total: number) {
    return calculateTotalWithDiscount(discount, total) - discount.discountValue;
  }

  function calculateTotalTaxWithDiscount(discount: Discount, priceTotalTaxMap: Map<number, number>){
    const taxMapWithReduction = new Map<number, number>();
    priceTotalTaxMap.forEach( (value: number, key: number) => {
      taxMapWithReduction.set(key, (value / 100) * (100 - discount .discountPercentage));
    });
    return taxMapWithReduction;
  }
};

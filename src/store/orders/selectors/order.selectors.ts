import { createSelector } from '@ngrx/store';

import { AppState } from '../../app.state';
import { OrderState } from '../state/order.state';

const selectOrders = (state: AppState) => state.orders;

export const selectOrderList = createSelector(
  selectOrders,
  (state: OrderState) => state.orders
);

export const orderError = createSelector(
  selectOrders,
  (state: OrderState) => state.orderError
);

export const selectDiscountPercentageValue = createSelector(
  selectOrders,
  (state: OrderState) => state.discountPercentageValue
);


export const selectOrderTotalPrice = createSelector(
  selectOrders,
  (state: OrderState) => state.priceTotal
);

export const selectOrderTotalPriceWithDiscount = createSelector(
  selectOrders,
  (state: OrderState) => state.priceTotalWithDiscount
);

export const selectOrderTotalPriceWithDiscountAndReduction = createSelector(
  selectOrders,
  (state: OrderState) => state.priceTotalWithDiscountAndReduction
);

export const selectOrderTotalPriceTaxMap = createSelector(
  selectOrders,
  (state: OrderState) => state.priceTotalTaxMap
);

export const selectOrderTotalTaxMapWithDiscount = createSelector(
  selectOrders,
  (state: OrderState) => state.priceTotalTaxMapWithDiscount
);

export const selectDiscount = createSelector(
  selectOrders,
  (state: OrderState) => state.discount
);

export const selectTotalAmount = createSelector(
  selectOrders,
  (state: OrderState) => state.totalAmount
);

export const selectTransactionRef = createSelector(
  selectOrders,
  (state: OrderState) => state.transactionRef
);

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

export const selectOrderTotalPrice = createSelector(
  selectOrders,
  (state: OrderState) => state.priceTotal
);

export const selectOrderTotalPriceTaxMap = createSelector(
  selectOrders,
  (state: OrderState) => state.priceTotalTaxMap
);

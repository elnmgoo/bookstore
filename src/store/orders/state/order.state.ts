import {Order} from '../models/order';

export interface OrderState {
  orders: Array<Order>;
  orderIdCounter: number;
  priceTotal: number;
  priceTotalTaxMap: Map<number, number>;
  orderError: Error;
}

export const initialOrderState: OrderState = {
  orders: Array<Order>(),
  orderIdCounter: 0,
  priceTotal: 0,
  priceTotalTaxMap: new Map<number, number>(),
  orderError: null,
};

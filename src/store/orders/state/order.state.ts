import {Order} from '../models/order';
import {Discount} from '../models/discount';

export interface OrderState {
  orders: Array<Order>;
  orderIdCounter: number;
  priceTotal: number;
  priceTotalWithDiscount: number;
  priceTotalWithDiscountAndReduction: number;
  priceTotalTaxMap: Map<number, number>;
  priceTotalTaxMapWithDiscount: Map<number, number>;
  discountPercentageValue: number;
  totalAmount: number;
  discount: Discount;
  orderError: Error;
}

export const initialOrderState: OrderState = {
  orders: Array<Order>(),
  orderIdCounter: 0,
  priceTotal: 0,
  priceTotalWithDiscount: 0,
  priceTotalWithDiscountAndReduction: 0,
  priceTotalTaxMap: new Map<number, number>(),
  priceTotalTaxMapWithDiscount: new Map<number, number>(),
  discountPercentageValue: 0,
  totalAmount: 0,
  discount: {
    discountText: 'Af',
    discountValue: 0,
    discountPercentageText: 'Korting',
    discountPercentage: 0
  },
  orderError: null,
};

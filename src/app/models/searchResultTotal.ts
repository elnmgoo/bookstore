import {PurchaseOrder, PurchaseOrderAdapter} from './purchaseOrder';
import {Injectable} from '@angular/core';
import {Adapter} from '../Adapter';

export class SearchResultTotal {
  purchaseOrders: PurchaseOrder[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable;
  size: number;
  sort;
  totalElements: number;
  totalPages: number;

  constructor(purchaseOrders: PurchaseOrder[], empty: boolean, first: boolean, last: boolean, aNumber: number, numberOfElements: number,
              pageable, size: number, sort, totalElements: number, totalPages: number) {
    this.purchaseOrders = purchaseOrders;
    this.empty = empty;
    this.first = first;
    this.last = last;
    this.number = aNumber;
    this.numberOfElements = numberOfElements;
    this.pageable = pageable;
    this.size = size;
    this.sort = sort;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SearchResultPurchaseOrderAdapter implements Adapter<SearchResultTotal> {
  private purchaseOrderAdapter: PurchaseOrderAdapter = new PurchaseOrderAdapter();

  adapt(item: any): SearchResultTotal {
    let purchaseOrders = null;
    if (item.content != null) {
      purchaseOrders = item.content.map(purchaseOrder => this.purchaseOrderAdapter.adapt(purchaseOrder));
    }
    return new SearchResultTotal(purchaseOrders, item.empty, item.first, item.last, item.nuber, item.numberOfElements,
      item.pageable,  item.size, item.sort, item.totalElements, item.totalPages);
  }
}


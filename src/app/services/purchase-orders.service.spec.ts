import { TestBed } from '@angular/core/testing';

import { PurchaseOrdersService } from './purchase-orders.service';

describe('OrdersService', () => {
  let service: PurchaseOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

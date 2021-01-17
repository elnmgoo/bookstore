import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseOrdersComponent } from './purchase-orders.component';

describe('OrdersComponent', () => {
  let component: PurchaseOrdersComponent;
  let fixture: ComponentFixture<PurchaseOrdersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerkochtComponent } from './verkocht.component';

describe('OrdersComponent', () => {
  let component: VerkochtComponent;
  let fixture: ComponentFixture<VerkochtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerkochtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerkochtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InkoopComponent } from './inkoop.component';

describe('ProcurementComponent', () => {
  let component: InkoopComponent;
  let fixture: ComponentFixture<InkoopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InkoopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InkoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

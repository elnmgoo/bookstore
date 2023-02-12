import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KassaComponent } from './kassa.component';

describe('SalesComponent', () => {
  let component: KassaComponent;
  let fixture: ComponentFixture<KassaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KassaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KassaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

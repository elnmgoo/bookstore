import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoekenComponent } from './boeken.component';

describe('BooksComponent', () => {
  let component: BoekenComponent;
  let fixture: ComponentFixture<BoekenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoekenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoekenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

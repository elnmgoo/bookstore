import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArtikelenComponent } from './artikelen.component';

describe('ItemsComponent', () => {
  let component: ArtikelenComponent;
  let fixture: ComponentFixture<ArtikelenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtikelenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtikelenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

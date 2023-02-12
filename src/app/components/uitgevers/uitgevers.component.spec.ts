import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UitgeversComponent } from './uitgevers.component';

describe('PublishersComponent', () => {
  let component: UitgeversComponent;
  let fixture: ComponentFixture<UitgeversComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UitgeversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UitgeversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

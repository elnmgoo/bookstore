import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoekDialogComponent } from './boek-dialog.component';

describe('BookDialogComponent', () => {
  let component: BoekDialogComponent;
  let fixture: ComponentFixture<BoekDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoekDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoekDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

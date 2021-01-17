import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BookDialogComponent } from './book-dialog.component';

describe('BookDialogComponent', () => {
  let component: BookDialogComponent;
  let fixture: ComponentFixture<BookDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BookDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

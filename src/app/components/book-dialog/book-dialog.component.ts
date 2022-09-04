import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Book} from '../../../store/book/models/book';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PriceValidator} from '../../validators/price.validator';
import {AppConstants} from '../../app-constants';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {selectPublisherList} from '../../../store/publishers/selectors/publisher.selectors';
import {AppState} from '../../../store/app.state';
import {GetPublishers} from '../../../store/publishers/actions/publisher.actions';
import {BooksService} from '../../services/book.service';
import {Publisher} from '../../../store/publishers/models/publisher';
import {ProcurementService} from '../../services/procurement.service';
import {Procurement} from '../../models/procurement';


@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrls: ['./book-dialog.component.scss']
})
export class BookDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('autofocus') private autofocusField: ElementRef;
  @Input() public book: Book;
  @Input() public bNew: boolean;
  @Input() private service: BooksService;
  @Input() private procurementService: ProcurementService;

  bookForm: FormGroup;
  publisher$ = this.store.pipe(select(selectPublisherList));
  publisher: Publisher;

  constructor(public activeModal: NgbActiveModal,
              private store: Store<AppState>,
              private formBuilder: FormBuilder
  ) {
  }

  ngAfterViewInit(): void {
    this.autofocusField.nativeElement.focus();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key){
      case 'F1':
        if (this.bookForm.valid) {
          this.onAddBookButton();
        }
        event.preventDefault();
        event.stopPropagation();
        break;
      case 'F8':
        if (event.shiftKey) {
          if (this.bookForm.controls.amount.value > 0) {
            this.bookForm.controls.amount.setValue(this.bookForm.controls.amount.value - 1);
          }
        } else {
          this.bookForm.controls.amount.setValue(this.bookForm.controls.amount.value + 1);
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new GetPublishers());
    this.bookForm = this.formBuilder.group({
      isbn: [this.book.isbn, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      title: [this.book.title, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      author: [this.book.author, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      publisher: [this.book.publisher.id, Validators.required],
      price: [this.book.price.toString(10).replace('.', ','),
        [Validators.required, Validators.minLength(1), PriceValidator(AppConstants.maxPriceBook)]],
      supply: [this.book.supply, [Validators.required, Validators.min(0), Validators.max(99)]],
      amount: [1, [Validators.required, Validators.min(0), Validators.max(99)]],
      added: ['', [Validators.minLength(0), Validators.maxLength(100)]]
    });
    this.publisher = this.book.publisher;
  }

  onChangeIsbn(event: Event) {
    const isbn = this.bookForm.controls.isbn.value;
    if (isbn.length === 13) {
      this.service.getBook(isbn).subscribe((book: Book) => {
        this.bookForm.controls.title.setValue(book.title);
        this.bookForm.controls.author.setValue(book.author);
        this.bookForm.controls.publisher.setValue(book.publisher.id);
        this.bookForm.controls.price.setValue(book.price.toString(10).replace('.', ','));
        this.bookForm.controls.amount.setValue(1);
        this.bookForm.controls.supply.setValue(book.supply);
        this.bookForm.controls.amount.setValue(1);
        this.publisher.id = book.publisher.id;
        this.publisher.publisher = book.publisher.publisher;
      });
    }
  }

  bookSuccesfullyAdded(book: Book){
    this.bookForm.controls.added.setValue(
      book.title + ', ' + book.author + ' (' +
      this.bookForm.controls.amount.value  + ')'
    );
    this.bookForm.controls.isbn.setValue('');
    this.bookForm.controls.title.setValue('');
    this.bookForm.controls.author.setValue('');
    this.bookForm.controls.publisher.setValue('');
    this.bookForm.controls.price.setValue(0);
    this.bookForm.controls.amount.setValue(0);
    this.bookForm.controls.supply.setValue(0);
    this.bookForm.controls.amount.setValue(0);
    this.autofocusField.nativeElement.focus();
  }


  onAddBookButton() {
    const book: Book = new Book(
      this.bookForm.controls.isbn.value,
      this.bookForm.controls.title.value,
      this.bookForm.controls.author.value,
      this.bookForm.controls.supply.value + this.bookForm.controls.amount.value,
      this.publisher,
      Number(this.bookForm.controls.price.value.replace(',', '.')),
      false);

    if (this.procurementService != null){
      const procurement: Procurement = new Procurement(  0, new Date().getTime(),
        Number(this.bookForm.controls.price.value.replace(',', '.')), this.bookForm.controls.amount.value,
        book);
      this.procurementService.add(procurement).subscribe(() => {
        this.bookSuccesfullyAdded(procurement.book);
      });
    } else {
      this.service.update(book).subscribe(() => {
        this.bookSuccesfullyAdded(book);
        }
      );
    }
  }

  onChange($event) {
    const text = $event.target.options[$event.target.options.selectedIndex].text;
    const value = $event.target.options[$event.target.options.selectedIndex].value;
    this.publisher.id = value;
    this.publisher.publisher = text;
  }

  onEditBookButton() {
    const book: Book = new Book(
      this.bookForm.controls.isbn.value,
      this.bookForm.controls.title.value,
      this.bookForm.controls.author.value,
      this.bookForm.controls.supply.value,
      this.publisher,
      Number(this.bookForm.controls.price.value.replace(',', '.')),
      false
    );
    this.service.update(book).subscribe(() => this.activeModal.close());
  }

  onCancelButton() {
    this.activeModal.close();
  }
}

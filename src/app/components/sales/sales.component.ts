import {AfterContentChecked, AfterViewInit, Component, Directive, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Order} from '../../../store/orders/models/order';
import {select, Store} from '@ngrx/store';
import {selectItemList} from '../../../store/items/selectors/item.selectors';
import {AppState} from '../../../store/app.state';
import {GetItems} from '../../../store/items/actions/item.actions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '../../../app/app-constants';
import {PriceValidator} from '../../validators/price.validator';
import {OrderService} from '../../../store/orders/services/order.service';
import {selectOrderList, selectOrderTotalPrice, selectOrderTotalPriceTaxMap} from '../../../store/orders/selectors/order.selectors';
import {AddOrder, DeleteOrder, GetOrders} from '../../../store/orders/actions/order.actions';
import {selectPublisherList} from '../../../store/publishers/selectors/publisher.selectors';
import {GetPublishers} from '../../../store/publishers/actions/publisher.actions';
import {Observable} from 'rxjs';
import {BookService} from '../../../store/book/service/book.service';
import {Book} from '../../../store/book/models/book';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})


export class SalesComponent implements OnInit, AfterViewInit {
  @ViewChild('orderwindow') private myScrollContainer: ElementRef;
  @ViewChild('autofocus') private autofocusField: ElementRef;

  taxArray = AppConstants.taxArray;
  itemForm: FormGroup;
  bookForm: FormGroup;

  item$ = this.store.pipe(select(selectItemList));
  order$ = this.store.pipe(select(selectOrderList));
  publisher$ = this.store.pipe(select(selectPublisherList));
  orderTotalPrice$ = this.store.pipe(select(selectOrderTotalPrice));
  orderTotalPriceTaxMap$ = this.store.pipe(select(selectOrderTotalPriceTaxMap));

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private element: ElementRef<HTMLInputElement>,
              private bookService: BookService
  ) {
  }

  ngAfterViewInit(): void {
    this.autofocusField.nativeElement.focus();
  }


  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      isbn: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      publisher: ['', Validators.required],
      price: ['', [Validators.required, Validators.minLength(1), PriceValidator(AppConstants.maxPriceBook)]],
      amount: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      tax: ['21', [Validators.required, Validators.min(1)]]
    });

    this.itemForm = this.formBuilder.group({
      item: ['', Validators.required],
      itemAmount: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      itemPrice: ['', [Validators.required, Validators.minLength(1), PriceValidator(AppConstants.maxPriceArticle)]],
      itemTax: ['', [Validators.required, Validators.min(1)]]
    });
    this.store.dispatch(new GetItems());
    this.store.dispatch(new GetOrders());
    this.store.dispatch(new GetPublishers());
  }

  onInputArticleSelected(event) {
    console.log(event.target.selectedIndex);
    console.log(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemTax.setValue(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemPrice.setValue(this.itemForm.controls.item.value.price.replace('.', ','));
    this.itemForm.controls.itemAmount.setValue(1);
  }

  onAddItemButton() {
    let descript = this.itemForm.controls.item.value.description;
    if (this.itemForm.controls.itemAmount.value > 1) {
      descript = '' + this.itemForm.controls.itemAmount.value + ' x ' + this.itemForm.controls.item.value.description;
    }
    console.log('itemprice = ' + this.itemForm.controls.itemPrice.value);
    const order = {
      isbn: '',
      item: this.itemForm.controls.item.value.description,
      price: (parseFloat(this.itemForm.controls.itemPrice.value.replace(',', '.')) * 100.0),
      amount: this.itemForm.controls.itemAmount.value,
      author: '',
      publisher: '',
      tax: this.itemForm.controls.itemTax.value,
      title: '',
      description: descript
    } as Order;
    this.store.dispatch(new AddOrder(order));
    this.itemForm.reset();
    setTimeout(() => this.scrollOrderWindow(), 1000);
  }

  onAddBookButton(){
    let descript = this.bookForm.controls.title.value + ', ' + this.bookForm.controls.author.value;
    if (this.bookForm.controls.amount.value > 1) {
      descript = '' + this.bookForm.controls.amount.value + ' x ' + descript;
    }
    console.log('bookprice = ' + this.bookForm.controls.price.value);
    const order = {
      isbn: this.bookForm.controls.isbn.value,
      item: '',
      price: (parseFloat(this.bookForm.controls.price.value.replace(',', '.')) * 100.0),
      amount: this.bookForm.controls.amount.value,
      author: this.bookForm.controls.author.value,
      publisher: this.bookForm.controls.publisher.value,
      tax: this.bookForm.controls.tax.value,
      title: this.bookForm.controls.title.value,
      description: descript
    } as Order;
    this.store.dispatch(new AddOrder(order));
    this.bookForm.reset();
    setTimeout(() => this.scrollOrderWindow(), 1000);
  }

  onPayButton() {
    console.log('Afrekenen en een bonnetje afdrukken');
  }

  scrollOrderWindow(): string {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
    return ('');
  }

  onDelete(indexOfElement: number, order: Order, event) {
    this.store.dispatch(new DeleteOrder(order));
  }

  onChangeIsbn(event: Event) {
    const isbn = this.bookForm.controls.isbn.value;
    console.log('isbn: ' + isbn);
    if (isbn.length === 13) {
      this.bookService.getBook(isbn).subscribe((book: Book) => {
        this.bookForm.controls.title.setValue(book.title);
        this.bookForm.controls.author.setValue(book.author);
        this.bookForm.controls.publisher.setValue(book.publisher.id);
        this.bookForm.controls.price.setValue(book.price.toString(10).replace('.', ','));
        this.bookForm.controls.amount.setValue(1);
        this.bookForm.controls.tax.setValue(21);
      });
    }
  }
}

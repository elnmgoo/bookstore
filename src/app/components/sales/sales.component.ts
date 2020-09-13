import {
  AfterViewInit,
  Component,
  ElementRef,
  Injectable,
  OnInit,
  ViewChild
} from '@angular/core';
import {Order} from '../../../store/orders/models/order';
import {select, Store} from '@ngrx/store';
import {selectItemList} from '../../../store/items/selectors/item.selectors';
import {AppState} from '../../../store/app.state';
import {GetItems} from '../../../store/items/actions/item.actions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '../../app-constants';
import {PriceValidator} from '../../validators/price.validator';
import {selectOrderList, selectOrderTotalPrice, selectOrderTotalPriceTaxMap} from '../../../store/orders/selectors/order.selectors';
import {AddOrder, BookOrder, DeleteOrder, GetOrders} from '../../../store/orders/actions/order.actions';
import {selectPublisherList} from '../../../store/publishers/selectors/publisher.selectors';
import {GetPublishers} from '../../../store/publishers/actions/publisher.actions';
import {BookService} from '../../../store/book/service/book.service';
import {Book} from '../../../store/book/models/book';
import {NgbCalendar, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateFormatPipe2Time} from './DateFormatPipe2Time';
import {DateFormatPipe2Date} from './DateFormatPipe2Date';
import {PrintService} from '../../../store/book/service/print.service';
import {concatMap, tap} from 'rxjs/operators';
import {formatNumber} from '@angular/common';

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '-';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})


export class SalesComponent implements OnInit, AfterViewInit {
  @ViewChild('orderwindow') private myScrollContainer: ElementRef;
  @ViewChild('autofocus') private autofocusField: ElementRef;
  @ViewChild('autofocusPrijs') private autofocusPrijsField: ElementRef;

  taxArray = AppConstants.taxArray;
  itemForm: FormGroup;
  bookForm: FormGroup;
  time = '';
  timeStamp = 0;
  order = [];

  item$ = this.store.pipe(select(selectItemList));
  order$ = this.store.pipe(select(selectOrderList));
  publisher$ = this.store.pipe(select(selectPublisherList));
  orderTotalPrice$ = this.store.pipe(select(selectOrderTotalPrice));
  orderTotalPriceTaxMap$ = this.store.pipe(select(selectOrderTotalPriceTaxMap));


  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private element: ElementRef<HTMLInputElement>,
              private bookService: BookService,
              private calendar: NgbCalendar,
              public formatter: NgbDateParserFormatter,
              private dateFormatPipe2Time: DateFormatPipe2Time,
              private dateFormatPipe2Date: DateFormatPipe2Date,
              private printService: PrintService
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
      tax: ['21', [Validators.required, Validators.min(1)]],
      date: [this.calendar.getToday()]
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
    this.order$.subscribe(order => {
      this.order = order;
    });
  }

  onInputArticleSelected(event) {
    console.log(event.target.selectedIndex);
    console.log(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemTax.setValue(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemPrice.setValue(this.itemForm.controls.item.value.price.replace('.', ','));
    this.itemForm.controls.itemAmount.setValue(1);
    if (this.itemForm.controls.itemPrice.value.length === 0) {
      this.autofocusPrijsField.nativeElement.focus();
    }
  }

  onAddItemButton() {
    this.setTimeStamp();
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
      description: descript,
      dateTime: 0
    } as Order;
    this.store.dispatch(new AddOrder(order));
    this.itemForm.reset();
    setTimeout(() => this.scrollOrderWindow(), 1000);
  }

  onAddBookButton() {
    this.setTimeStamp();
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
      description: descript,
      dateTime: 0
    } as Order;
    this.store.dispatch(new AddOrder(order));
    const date = this.bookForm.controls.date.value;
    this.bookForm.reset();
    this.bookForm.controls.date.setValue(date);
    setTimeout(() => this.scrollOrderWindow(), 1000);
  }

  onPayButton() {
    const spaces = '                                    ';
    let total = 0;
    /*let totalTax[];*/
    console.log('Afrekenen en een bonnetje afdrukken');
    this.order.forEach(myOrder => {
      console.log('Order: ' + myOrder.description);
      const order = {...myOrder};
      order.dateTime = this.timeStamp;
      this.store.dispatch(new BookOrder(order));
    });
    console.log('bonnetje afdrukken');
    let buffer = '';
    let description = '';
    this.order.forEach(myOrder => {
      if (buffer.length > 0) {
        buffer += '\n';
      }
      buffer += ' - ';
      if (myOrder.isbn.length > 0) {
        description = myOrder.description + ' [' + myOrder.isbn + ']';
      } else {
        description = myOrder.description;
      }
      description = description.substr(0, Math.min(description.length, 35));
      buffer += description + spaces.substr(0, 36 - description.length);
      buffer += '€';
      const price = formatNumber((myOrder.price * myOrder.amount) / 100, 'nl', '1.2-2');
      buffer += spaces.substr(0, 7 - price.length) + price;
      total += (myOrder.price * myOrder.amount) / 100;
    });
    this.printService.initPrinter().pipe(
      tap(res => console.log('initPrinter ', res)),
      concatMap(res => this.printService.printLogoAndAddress()),
      tap(res => console.log('printLogoAndAddress ', res)),
      concatMap(res => this.printService.printStringNewLine(buffer, false, false)),
      tap(res => console.log('printStringNewLine ', res)),
      concatMap(res => this.printService.printSolidLine()),
      tap(res => console.log('printSolidLine ', res)),
      concatMap(res => this.printService.printToPrinter())
    ).subscribe(res => console.log('printToPrinter', res));
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

  setTimeStamp() {
    const currentDate = new Date();
    const currentDateStr = this.dateFormatPipe2Date.transform(currentDate);
    const formDate = new Date(this.bookForm.controls.date.value.year, this.bookForm.controls.date.value.month - 1,
      this.bookForm.controls.date.value.day);
    const formDateStr = this.dateFormatPipe2Date.transform(formDate);
    if (currentDateStr === formDateStr) {
      this.time = currentDateStr + ' ' + this.dateFormatPipe2Time.transform(currentDate);
      this.timeStamp = currentDate.getTime();
    } else {
      this.time = formDateStr;
      this.timeStamp = formDate.getTime();
    }
  }

}

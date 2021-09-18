import {
  AfterViewInit,
  Component,
  ElementRef, HostListener,
  Injectable, OnDestroy,
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
import {
  selectOrderList,
  selectOrderTotalPrice,
  selectOrderTotalPriceTaxMap
} from '../../../store/orders/selectors/order.selectors';
import {AddOrder, BookOrder, DeleteAllOrder, DeleteOrder, GetOrders} from '../../../store/orders/actions/order.actions';
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
import {Subscription} from 'rxjs';

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


export class SalesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('orderwindow') private myScrollContainer: ElementRef;
  @ViewChild('autofocus') private autofocusField: ElementRef;
  @ViewChild('autofocusPrijs') private autofocusPrijsField: ElementRef;
  spaces = '                                    ';
  subscriptions = new Subscription();
  taxArray = AppConstants.taxArray;
  itemForm: FormGroup;
  bookForm: FormGroup;
  time = '';
  timeStamp = 0;
  order = [];
  orderTotalPriceTaxMap;
  orderTotalPrice = 0;
  printOrder = true;
  payed = false;

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
              private dateFormatPipe2Time: DateFormatPipe2Time,
              private dateFormatPipe2Date: DateFormatPipe2Date,
              private printService: PrintService
  ) {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F1':
        if (this.bookForm.valid) {
          this.onAddBookButton();
        }
        event.preventDefault();
        event.stopPropagation();
        break;
      case 'F2':
        if (this.itemForm.valid) {
          this.onAddItemButton();
        }
        event.preventDefault();
        event.stopPropagation();
        break;
      case 'F3':
        if (this.order.length > 0) {
          this.onPayButton();
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
      case 'F9':
        if (event.shiftKey) {
          if (this.itemForm.controls.itemAmount.value > 0) {
            this.itemForm.controls.itemAmount.setValue(this.itemForm.controls.itemAmount.value - 1);
          }
        } else {
          this.itemForm.controls.itemAmount.setValue(this.itemForm.controls.itemAmount.value + 1);
        }
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
      amount: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
      discount: [''],
      total: ['', [Validators.required, Validators.minLength(1)]],
      tax: ['9', [Validators.required, Validators.min(0)]],
      date: [this.calendar.getToday()],
      supply: [''],
      supplyDepot: ['']
    });

    this.itemForm = this.formBuilder.group({
      item: ['', Validators.required],
      itemAmount: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
      itemPrice: ['', [Validators.required, Validators.minLength(1), PriceValidator(AppConstants.maxPriceArticle)]],
      itemTax: ['', [Validators.required, Validators.min(0)]],
      itemDiscount: [''],
      itemTotal: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.store.dispatch(new GetItems());
    this.store.dispatch(new GetOrders());
    this.store.dispatch(new GetPublishers());
    this.subscriptions.add(this.order$.subscribe(order => {
      this.order = order;
    }));

    this.subscriptions.add(this.orderTotalPrice$.subscribe(orderTotalPrice => {
      this.orderTotalPrice = orderTotalPrice;
    }));

    this.subscriptions.add(this.orderTotalPriceTaxMap$.subscribe(orderTotalPriceTaxMap => {
      this.orderTotalPriceTaxMap = orderTotalPriceTaxMap;
    }));
  }

  onInputArticleSelected(event) {
    console.log(event.target.selectedIndex);
    console.log(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemTax.setValue(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemPrice.setValue(this.itemForm.controls.item.value.price.replace('.', ','));
    this.itemForm.controls.itemAmount.setValue(1);
    this.itemForm.controls.itemDiscount.setValue('');
    if (this.itemForm.controls.itemPrice.value.length === 0) {
      this.autofocusPrijsField.nativeElement.focus();
    }
    this.calculateTotalPriceItem();
  }

  calculateTotalPriceBook() {
    let totalPrice = this.bookForm.controls.amount.value * Number(this.bookForm.controls.price.value.replace(',', '.'));
    if (this.bookForm.controls.discount.value.toString().length > 0) {
      totalPrice -= Number(this.bookForm.controls.discount.value.toString().replace(',', '.'));
    }
    this.bookForm.controls.total.setValue(totalPrice.toFixed(2).replace('.', ','));
  }

  calculateTotalPriceItem() {
    let itemTotalPrice = this.itemForm.controls.itemAmount.value * Number(this.itemForm.controls.itemPrice.value.replace(',', '.'));
    if (this.itemForm.controls.itemDiscount.value.toString().length > 0) {
      itemTotalPrice -= Number(this.itemForm.controls.itemDiscount.value.toString().replace(',', '.'));
    }
    this.itemForm.controls.itemTotal.setValue(itemTotalPrice.toFixed(2).replace('.', ','));
  }

  onAddItemButton() {
    if (this.payed) {
      this.payed = false;
    }
    this.setTimeStamp();
    console.log('itemprice = ' + this.itemForm.controls.itemPrice.value);
    console.log('totalPrice: ' + this.orderTotalPrice);
    let description = this.itemForm.controls.item.value.description;
    if (this.itemForm.controls.itemAmount.value > 1) {
      if (this.itemForm.controls.itemDiscount.value > 0) {
        description += ' (' + this.itemForm.controls.itemPrice.value + ' x ' + this.itemForm.controls.itemAmount.value +
          ' - ' + this.itemForm.controls.itemDiscount.value + ')';
      } else {
        description += ' (' + this.itemForm.controls.itemPrice.value + ' x ' + this.itemForm.controls.itemAmount.value + ')';
      }
    } else {
      if (this.itemForm.controls.itemDiscount.value > 0) {
        description += ' (' + this.itemForm.controls.itemPrice.value + ' - ' + this.itemForm.controls.itemDiscount.value + ')';
      }
    }
    const order = {
      isbn: '',
      item: this.itemForm.controls.item.value.description,
      price: Math.round(Number(this.itemForm.controls.itemPrice.value.replace(',', '.')) * 100.0),
      amount: this.itemForm.controls.itemAmount.value,
      author: '',
      publisher: '',
      tax: parseInt(this.itemForm.controls.itemTax.value, 10),
      title: '',
      description,
      dateTime: 0,
      total: this.itemForm.controls.itemAmount.value * Math.round(Number(this.itemForm.controls.itemPrice.value.replace(',', '.')) * 100.0)
        - Math.round(Number(this.itemForm.controls.itemDiscount.value.replace(',', '.')) * 100.0),
      discount: (Number(this.itemForm.controls.itemDiscount.value.toString().replace(',', '.')) * 100.0)
    } as Order;
    this.store.dispatch(new AddOrder(order));
    this.itemForm.reset();
    setTimeout(() => this.scrollOrderWindow(), 1000);
  }

  onAddBookButton() {
    if (this.payed) {
      this.payed = false;
    }
    this.setTimeStamp();
    let description = this.bookForm.controls.title.value + ', ' + this.bookForm.controls.author.value;
    if (this.bookForm.controls.amount.value > 1) {
      if (this.bookForm.controls.discount.value > 0) {
        description += ' (' + this.bookForm.controls.price.value + ' x ' + this.bookForm.controls.amount.value +
          ' - ' + this.bookForm.controls.discount.value + ')';
      } else {
        description += ' (' + this.bookForm.controls.price.value + ' x ' + this.bookForm.controls.amount.value + ')';
      }
    } else {
      if (this.bookForm.controls.discount.value > 0) {
        description += ' (' + this.bookForm.controls.price.value + ' - ' + this.bookForm.controls.discount.value + ')';
      }
    }
    const order = {
      isbn: this.bookForm.controls.isbn.value,
      item: '',
      price: Math.round(Number(this.bookForm.controls.price.value.replace(',', '.')) * 100),
      amount: this.bookForm.controls.amount.value,
      author: this.bookForm.controls.author.value,
      publisher: this.bookForm.controls.publisher.value,
      tax: parseInt(this.bookForm.controls.tax.value, 10),
      title: this.bookForm.controls.title.value,
      description,
      dateTime: 0,
      discount: (Number(this.bookForm.controls.discount.value.toString().replace(',', '.')) * 100.0),
      total: this.bookForm.controls.amount.value * Math.round(Number(this.bookForm.controls.price.value.replace(',', '.')) * 100.0)
        - Math.round(Number(this.bookForm.controls.discount.value.replace(',', '.')) * 100.0),
    } as Order;
    this.store.dispatch(new AddOrder(order));
    const date = this.bookForm.controls.date.value;
    this.bookForm.reset();
    this.bookForm.controls.date.setValue(date);
    setTimeout(() => this.scrollOrderWindow(), 1000);
    this.autofocusField.nativeElement.focus();
  }

  formatDescription(description, size) {
    const arrayDescription = [];
    const splittedDescription = description.split(' ');
    let line = '';
    splittedDescription.forEach(word => {
      const subword = word.substr(0, Math.min(word.length, size));
      if (line.length === 0) {
        line = subword;
      } else {
        if (line.length + subword.length >= (size - 1)) {
          arrayDescription.push(line + this.spaces.substr(0, size - line.length));
          line = subword;
        } else {
          line += ' ' + subword;
        }
      }
    });
    if (line.length > 0) {
      arrayDescription.push(line + this.spaces.substr(0, size - line.length));
    }
    return arrayDescription;
  }

  onPayButton() {
    console.log('Afrekenen en een bonnetje afdrukken');
    this.order.forEach(myOrder => {
      console.log('Order: ' + myOrder.description);
      const order = {...myOrder};
      order.dateTime = this.timeStamp;
      this.store.dispatch(new BookOrder(order));
    });
    let buffer = '';
    let description = '';
    this.order.forEach(myOrder => {
      if (myOrder.isbn.length > 0) {
        description = myOrder.description + ' [' + myOrder.isbn + ']';
      } else {
        description = myOrder.description;
      }
      let descriptionBuffer = '';
      const descriptionArray = this.formatDescription(description, 36);
      descriptionArray.forEach(line => {
          if (descriptionBuffer.length === 0) {
            if (buffer.length === 0) {
              descriptionBuffer += ' - ' + line + '€';
            } else {
              descriptionBuffer += '\n - ' + line + '€';
            }
            const price = formatNumber((myOrder.price * myOrder.amount) / 100, 'nl', '1.2-2');
            descriptionBuffer += this.spaces.substr(0, 8 - price.length) + price;
          } else {
            descriptionBuffer += '\n   ' + line;
          }
        }
      );
      buffer += descriptionBuffer;
    });
    const totalPrice = formatNumber(this.orderTotalPrice / 100, 'nl', '1.2-2');
    const totalReceipt = '   Totaal te betalen                   €' + this.spaces.substr(0, 8 - totalPrice.length) + totalPrice;
    let taxReceipt = '';
    this.taxArray.forEach(tax => {
      if (this.orderTotalPriceTaxMap.get(tax) > 0) {
        if (taxReceipt.length > 0) {
          taxReceipt += '\n';
        }
        let taxString = '   Totaal Btw ' + formatNumber(tax, 'nl', '2.0') + '%: € ' +
          formatNumber(this.orderTotalPriceTaxMap.get(tax) / 100, 'nl', '1.2-2');
        const taxPrice = formatNumber(((this.orderTotalPriceTaxMap.get(tax) / (100 + tax)) * tax) / 100, 'nl', '1.2-2');
        taxString += this.spaces.substr(0, 39 - taxString.length) +
          '€' + this.spaces.substr(0, 8 - taxPrice.length) + taxPrice;
        taxReceipt += taxString;
      }
    });
    if (this.printOrder === true) {
      console.log('bonnetje afdrukken');
      this.printService.initPrinter().pipe(
        tap(res => console.log('initPrinter ', res)),
        concatMap(() => this.printService.printLogoAndAddress()),
        concatMap(res => this.printService.printStringNewLine(buffer, false, false)),
        concatMap(res => this.printService.printSolidLine()),
        concatMap(res => this.printService.printStringNewLine(totalReceipt, true, false)),
        concatMap(res => this.printService.printStringNewLine(taxReceipt, false, false)),
        concatMap(res => this.printService.printSolidLine()),
        concatMap(res => this.printService.printStringNewLine(this.time, false, true)),
        concatMap(res => this.printService.printStringNewLine('', false, false)),
        concatMap(res => this.printService.printStringNewLine('Ruilen binnen 14 dagen met bon.', false, true)),
        concatMap(res => this.printService.printStringNewLine('Bedankt voor uw aankoop en graag tot ziens!', false, true)),
        concatMap(res => this.printService.printToPrinter())
      ).subscribe(res => console.log('printToPrinter', res));
    }
    this.payed = true;
    setTimeout(() => this.store.dispatch(new DeleteAllOrder()), 1500);
    this.autofocusField.nativeElement.focus();
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
    if (isbn && isbn.length === 13) {
      this.bookService.getBook(isbn).subscribe((book: Book) => {
        this.bookForm.controls.supply.setValue(book.supply);
        this.bookForm.controls.supplyDepot.setValue(book.supplyDepot);
        this.bookForm.controls.title.setValue(book.title);
        this.bookForm.controls.author.setValue(book.author);
        this.bookForm.controls.publisher.setValue(book.publisher.id);
        this.bookForm.controls.price.setValue(book.price.toFixed(2).replace('.', ','));
        this.bookForm.controls.amount.setValue(1);
        this.bookForm.controls.tax.setValue(9);
        this.bookForm.controls.discount.setValue('');
        this.bookForm.controls.total.setValue(book.price.toFixed(2).replace('.', ','));
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

  onCheckboxChange(event) {
    this.printOrder = event.target.checked;
    console.log('printOrder ' + this.printOrder);
  }

}

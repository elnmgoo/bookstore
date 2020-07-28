import {AfterContentChecked, AfterViewInit, Component, Directive, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Order} from './order';
import {select, Store} from '@ngrx/store';
import {selectItemList} from '../../../store/items/selectors/item.selectors';
import {AppState} from '../../../store/app.state';
import {GetItems} from '../../../store/items/actions/item.actions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppConstants} from '../../../app/app-constants';
import {PriceValidator} from '../../validators/price.validator';

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
  priceTotal: number;
  priceTotalTaxMap = new Map();

  item$ = this.store.pipe(select(selectItemList));
  public orders: Order[] = [
    {
      isbn: '1234567890123',
      title: 'Boer Boris',
      price: 1200,
      amount: 1,
      author: 'Jaap Verbeek',
      publisher: 'zwijssen',
      tax: 21,
      item: '',
      description: 'Boer Boris, Jaap Verbeek'
    },
    {isbn: '', item: 'Kerstkaart', price: 200, amount: 1, author: '', publisher: '', tax: 9, title: '', description: 'Kerstkaart'},
    {
      isbn: '1234567890124',
      title: 'De Hobbit',
      price: 2500,
      amount: 1,
      author: 'Jaap Verbeek',
      publisher: 'zwijssen',
      tax: 21,
      item: '',
      description: 'De Hobbit, Jaap Verbeek'
    },
    {isbn: '', item: 'potlood', price: 1200, amount: 1, author: '', publisher: '', tax: 9, title: '', description: 'potlood'}
  ];

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder,
              private element: ElementRef<HTMLInputElement>) {
  }

  ngAfterViewInit(): void {
    this.autofocusField.nativeElement.focus();
  }


  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      isbn: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],

    });

    this.itemForm = this.formBuilder.group({
      item: ['', Validators.required],
      itemAmount: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      itemPrice: ['', [Validators.required, Validators.minLength(1), PriceValidator(AppConstants.maxPriceArticle)]],
      itemTax: ['', [Validators.required, Validators.min(1)]]
    });
    this.setTotals();
    this.store.dispatch(new GetItems());

  }

  onInputArticleSelected(event) {
    console.log(event.target.selectedIndex);
    console.log(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemTax.setValue(this.itemForm.controls.item.value.tax);
    this.itemForm.controls.itemPrice.setValue(this.itemForm.controls.item.value.price.replace('.', ','));
    this.itemForm.controls.itemAmount.setValue(1);
    /* console.log(this.selectedArticle.tax);
    this.tax = this.selectedArticle.tax;*/
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
    this.orders.push(order);
    this.setTotals();
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

  setTotals() {
    this.priceTotal = 0;
    this.taxArray.forEach((tax) => {
      this.priceTotalTaxMap.set(tax.toString(10), 0);
    });
    this.orders.forEach((order) => {
        const tax: string = order.tax.toString(10);
        const price = order.amount * order.price;
        this.priceTotal += price;
        this.priceTotalTaxMap.set(tax, this.priceTotalTaxMap.get(tax) + price);
      }
    );
  }

  onDelete(indexOfElement: number, order: Order, event) {
    this.orders.splice(indexOfElement, 1);
    this.setTotals();
  }
}

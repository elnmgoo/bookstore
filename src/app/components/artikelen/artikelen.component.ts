import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AddItem, DeleteItem, GetItems} from '../../../store/items/actions/item.actions';
import { selectItemList} from '../../../store/items/selectors/item.selectors';
import {AppState} from '../../../store/app.state';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {AppConstants} from '../../app-constants';
import {Item} from '../../../store/items/models/item';
import {PriceValidator} from "../../validators/price.validator";

@Component({
  selector: 'app-items',
  templateUrl: './artikelen.component.html',
  styleUrls: ['./artikelen.component.scss']
})
export class ArtikelenComponent implements OnInit {
  item$ = this.store.pipe(select(selectItemList));
  taxArray = AppConstants.taxArray;
  itemForm: UntypedFormGroup;

  constructor(
    private store: Store<AppState>,
    private formBuilder: UntypedFormBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      itemDescription: ['', [Validators.required, Validators.minLength(4)]],
      itemTax: [9, [Validators.required, Validators.min(0)]],
      itemPrice: ['', [Validators.required, Validators.minLength(1), PriceValidator(AppConstants.maxPriceArticle)]]
    });

    /*console.log('result: ' + result);*/
    this.store.dispatch(new GetItems());
  }


  onAddItemButton() {
    const item = {
      description: this.itemForm.controls.itemDescription.value, tax: this.itemForm.controls.itemTax.value,
      price: this.itemForm.controls.itemPrice.value, id: 0
    };
    this.store.dispatch(new AddItem(item));
    this.itemForm.controls.itemDescription.setValue('');
    this.itemForm.controls.itemTax.setValue('');
  }

  onDeleteItem(item: Item, event) {
    this.renderer.setStyle(event.target, 'background', 'skyblue');

    this.store.dispatch(new DeleteItem(item));
  }
}

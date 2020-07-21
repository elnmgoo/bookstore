import {Component, OnDestroy, OnInit} from '@angular/core';
import ItemState from '../../../store/items/reducers';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import Item from '../../../store/items/models/item';
import {map} from 'rxjs/operators';
import {AddItemAction, GetItemAction} from '../../../store/items/actions/item.actions';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy {
  item$: Observable<ItemState>;
  ItemSubscription: Subscription;
  ItemList: Item[] = [];
  itemError: Error = null;
  Description: '';
  Tax: number;
  constructor(
    private store: Store<{ items: ItemState }>) {
    this.item$ = store.pipe(select('items'));
  }

  ngOnInit(): void {
    this.ItemSubscription = this.item$
      .pipe(
        map(x => {
          this.ItemList = x.Items;
          this.itemError = x.ItemError;
        })
      ).subscribe();

    this.store.dispatch(GetItemAction());
  }
  ngOnDestroy() {
    if (this.ItemSubscription) {
      this.ItemSubscription.unsubscribe();
    }
  }
  createItem() {
    const item = { description: this.Description, tax: this.Tax, id: 0};
    this.store.dispatch(AddItemAction({ payload: item }));
    this.Description = '';
    this.Tax = 0;
  }
}

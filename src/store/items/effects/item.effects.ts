import {Injectable, OnInit} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, filter, take} from 'rxjs/operators';
import {Item} from '../models/item';
import {AddItem, AddItemSuccess, DeleteItemSuccess, EItemActions, GetItemsSuccess, ItemError} from '../actions/item.actions';
import {ItemService} from '../services/item.service';
import {AppConstants} from '../../../app/app-constants';

@Injectable()
export class ItemEffects {

  constructor(private action$: Actions, private itemService: ItemService) {
  }

  @Effect()
  GetItems$ = this.action$.pipe(
    ofType(EItemActions.GetItems),
    /*filter(() => AppConstants.getItemsCounter++ === 0), werkt ook echter take(1) is eenvoudiger*/
    take(1),
    mergeMap((action) =>
      this.itemService.getItems().pipe(
        map((data: Item[]) => {
          return new GetItemsSuccess(data);
        }),
        catchError((error: Error) => {
          return of(new ItemError(error));
        })
      )
    )
  );

  @Effect()
  AddItems$ = this.action$.pipe(
    ofType<AddItem>(EItemActions.AddItem),
    mergeMap(action =>
      this.itemService.addItem(action.payload)
        .pipe(
          map((data: Item) => {
            return new AddItemSuccess(data);
          }),
          catchError((error: Error) => {
            return of(new ItemError(error));
          })
        )
    )
  );

  @Effect()
  DeleteItems$ = this.action$.pipe(
    ofType<AddItem>(EItemActions.DeleteItem),
    mergeMap(action =>
      this.itemService.deleteItem(action.payload)
        .pipe(
          map((data: Item) => {
            return new DeleteItemSuccess(data);
          }),
          catchError((error: Error) => {
            return of(new ItemError(error));
          })
        )
    )
  );

}

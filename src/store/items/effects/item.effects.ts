import { Injectable } from '@angular/core';
import {Actions,  Effect, ofType} from '@ngrx/effects';
import {  of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ItemActions from '../actions/item.actions';
import Item from '../models/item';
import {ItemService} from '../services/item.service';

@Injectable()
export class ItemEffects {
  constructor(private itemService: ItemService, private action$: Actions) {
  }

  @Effect()
  GetItems$ = this.action$.pipe(
    ofType(ItemActions.GetItemAction),
    mergeMap((action) =>
      this.itemService.getItems().pipe(
        map((data: Item[]) => {
          return ItemActions.GetItemActionSuccess({payload: data});
        }),
        catchError((error: Error) => {
          return of(ItemActions.ItemActionError(error));
        })
      )
    )
  );

  @Effect()
  AddItems$ = this.action$.pipe(
    ofType(ItemActions.AddItemAction),
    mergeMap(action =>
      this.itemService.addItem(action.payload).pipe(
          map((data: Item) => {
            return ItemActions.AddItemActionSuccess({payload: data});
          }),
          catchError((error: Error) => {
            return of(ItemActions.ItemActionError(error));
          })
        )
    )
  );
}

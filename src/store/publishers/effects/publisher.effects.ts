import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, mergeMap, take} from 'rxjs/operators';
import {Publisher} from '../models/publisher';
import {AddPublisher, AddPublisherSuccess, DeletePublisher, DeletePublisherSuccess, EPublisherActions, GetPublishersSuccess,
  PublisherError} from '../actions/publisher.actions';
import {PublisherService} from '../services/publisher.service';

@Injectable()
export class PublisherEffects {

  constructor(private action$: Actions, private publisherService: PublisherService) {
  }

  @Effect()
  GetPublishers$ = this.action$.pipe(
    ofType(EPublisherActions.GetPublishers),
    take(1),
    mergeMap(() =>
      this.publisherService.getPublishers().pipe(
        map((data: Publisher[]) => {
          return new GetPublishersSuccess(data);
        }),
        catchError((error: Error) => {
          return of(new PublisherError(error));
        })
      )
    )
  );

  @Effect()
  AddPublishers$ = this.action$.pipe(
    ofType<AddPublisher>(EPublisherActions.AddPublisher),
    mergeMap(action =>
      this.publisherService.addPublisher(action.payload)
        .pipe(
          map((data: Publisher) => {
            return new AddPublisherSuccess(data);
          }),
          catchError((error: Error) => {
            return of(new PublisherError(error));
          })
        )
    )
  );

  @Effect()
  DeletePublishers$ = this.action$.pipe(
    ofType<DeletePublisher>(EPublisherActions.DeletePublisher),
    mergeMap(action =>
      this.publisherService.deletePublisher(action.payload)
        .pipe(
          map((data: Publisher) => {
            return new DeletePublisherSuccess(data);
          }),
          catchError((error: Error) => {
            return of(new PublisherError(error));
          })
        )
    )
  );
}

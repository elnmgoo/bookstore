import {Action} from '@ngrx/store';
import {Publisher} from '../models/publisher';

export enum EPublisherActions {
  GetPublishers = '[Publisher] - Get Publishers',
  GetPublishersRefresh = '[Publisher] - Get PublishersRefresh',
  GetPublishersSuccess = '[Publisher] - Get PublishersSuccess',
  AddPublisher = '[Publisher] - Add publisher',
  AddPublisherSuccess = '[Publisher] - Add publisher success',
  DeletePublisher = '[Publisher] - Delete publisher',
  DeletePublisherSuccess = '[Publisher] - Delete publisher success',
  PublisherError = '[Publisher] - Error'
}

export class GetPublishers implements Action {
  public readonly type = EPublisherActions.GetPublishers;
}

export class GetPublishersSuccess implements Action {
  public readonly type = EPublisherActions.GetPublishersSuccess;
  constructor(public payload: Publisher[]) {}
}

export class GetPublishersRefresh implements Action {
  public readonly type = EPublisherActions.GetPublishersRefresh;
  constructor() {}
}



export class AddPublisher implements Action {
  public readonly type = EPublisherActions.AddPublisher;
  constructor(public payload: Publisher) {}
}

export class AddPublisherSuccess implements Action {
  public readonly type = EPublisherActions.AddPublisherSuccess;
  constructor(public payload: Publisher) {}
}

export class DeletePublisher implements Action {
  public readonly type = EPublisherActions.DeletePublisher;
  constructor(public payload: Publisher) {}
}

export class DeletePublisherSuccess implements Action {
  public readonly type = EPublisherActions.DeletePublisherSuccess;
  constructor(public payload: Publisher) {}
}


export class PublisherError implements Action {
  public readonly type = EPublisherActions.PublisherError;
  constructor(public error: Error) {}
}

export type PublisherActions = GetPublishers | GetPublishersSuccess | AddPublisher |
  AddPublisherSuccess | DeletePublisher | DeletePublisherSuccess| PublisherError;

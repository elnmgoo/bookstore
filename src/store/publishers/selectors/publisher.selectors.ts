import { createSelector } from '@ngrx/store';

import { AppState } from '../../app.state';
import { PublisherState } from '../state/publisher.state';

const selectPublishers = (state: AppState) => state.publishers;

export const selectPublisherList = createSelector(
  selectPublishers,
  (state: PublisherState) => state.publishers
);

export const publisherError = createSelector(
  selectPublishers,
  (state: PublisherState) => state.publisherError
);


import {Publisher} from '../models/publisher';

export interface PublisherState {
  publishers: Array<Publisher>;
  publisherError: Error;
}

export const initialPublisherState: PublisherState = {
   publishers: Array<Publisher>(),
   publisherError: null,
 };

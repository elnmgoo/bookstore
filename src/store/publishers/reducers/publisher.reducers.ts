import {initialPublisherState, PublisherState} from '../state/publisher.state';
import {EPublisherActions, PublisherActions} from '../actions/publisher.actions';

export const publisherReducers = (
  state = initialPublisherState,
  action: PublisherActions
): PublisherState => {
  switch (action.type) {
    case EPublisherActions.GetPublishersSuccess: {
      return {...state, publishers: action.payload};
    }
    case EPublisherActions.AddPublisherSuccess: {
      return {...state, publishers: [...state.publishers, action.payload]};
    }
    case EPublisherActions.DeletePublisherSuccess: {
      return {...state, publishers: state.publishers.filter(publisher => publisher.id !== action.payload.id)};
    }
    case EPublisherActions.PublisherError: {
      console.log(action.error);
      return state;
    }
    default: {
      return state;
    }
  }
};

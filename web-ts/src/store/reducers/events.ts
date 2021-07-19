import { ActionTypes } from '../types';
import { EventsActions } from '../interfaces';

const initialState = {
  events: [],
  authEvents: [],
  newEvent: null,
  event: {},
};

export const eventsReducer = (state = initialState, action: EventsActions) => {
  switch (action.type) {
    case ActionTypes.GET_LOCAL_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    default:
      return state;
  }
};

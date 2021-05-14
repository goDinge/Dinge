import { GET_EVENTS, GET_LOCAL_EVENTS, CREATE_EVENT } from '../types';

const initialState = {
  events: [],
  newEvent: null,
  event: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    case GET_LOCAL_EVENTS: {
      return {
        ...state,
        events: action.events,
      };
    }
    case CREATE_EVENT: {
      return {
        ...state,
        newEvent: action.event,
      };
    }
  }
  return state;
};

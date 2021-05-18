import {
  GET_AUTH_EVENTS,
  GET_LOCAL_EVENTS,
  CREATE_EVENT,
  UPDATE_EVENT_LOCATION,
} from '../types';

const initialState = {
  events: [],
  authEvents: [],
  newEvent: null,
  event: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTH_EVENTS:
      return {
        ...state,
        authEvents: action.events,
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
    case UPDATE_EVENT_LOCATION:
      return {
        ...state,
        events: state.events.map((event, index) => {
          if (event._id === action.payload._id) {
            return {
              ...event,
              location: {
                latitude: action.payload.location.latitude,
                longitude: action.payload.location.longitude,
              },
            };
          }
          return event;
        }),
      };
  }
  return state;
};

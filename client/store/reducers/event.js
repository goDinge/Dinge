import { GET_EVENT, UPDATE_EVENT_LOCATION } from '../types';

const initialState = {
  event: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENT:
      return {
        ...state,
        event: action.event,
      };
    case UPDATE_EVENT_LOCATION:
      return {
        ...state,
        event: {
          ...state.event,
          location: {
            ...state.event.location,
            latitide: action.event.latitude,
            longitude: action.event.longitude,
          },
        },
      };
  }
  return state;
};

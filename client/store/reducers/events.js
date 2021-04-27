import { GET_EVENTS } from '../types';

const initialState = {
  events: [],
  newEvent: {},
  event: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        events: action.events,
      };
  }
  return state;
};

import { GET_EVENT, LIKE_EVENT, UNLIKE_EVENT, REPORT_EVENT } from '../types';

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
    case LIKE_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          likes: action.event.likes,
        },
      };
    case UNLIKE_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          likes: action.event.likes,
        },
      };
    case REPORT_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          reports: action.event.reports,
        },
      };
  }
  return state;
};

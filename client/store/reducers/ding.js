import { GET_DING, LIKE_DING, UNLIKE_DING, REPORT_DING } from '../types';

const initialState = {
  ding: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DING:
      return {
        ...state,
        ding: action.ding,
      };
    case LIKE_DING:
      return {
        ...state,
        ding: action.ding,
      };
    case UNLIKE_DING:
      return {
        ...state,
        ding: action.ding,
      };
    case REPORT_DING:
      return {
        ...state,
        ding: action.ding,
      };
  }
  return state;
};

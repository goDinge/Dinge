import {
  GET_DING,
  LIKE_DING,
  UNLIKE_DING,
  UPDATE_DING_LOCATION,
  REPORT_DING,
  POST_COMMENT,
} from '../types';

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
        ding: {
          ...state.ding,
          likes: action.ding.likes,
        },
      };
    case UNLIKE_DING:
      return {
        ...state,
        ding: {
          ...state.ding,
          likes: action.ding.likes,
        },
      };
    case UPDATE_DING_LOCATION:
      return {
        ...state,
        ding: action.ding,
      };
    case REPORT_DING:
      return {
        ...state,
        ding: {
          ...state.ding,
          reports: action.ding.reports,
        },
      };
    case POST_COMMENT:
      return {
        ...state,
        ding: action.ding,
      };
  }
  return state;
};

import {
  GET_DING,
  LIKE_DING,
  UNLIKE_DING,
  REPORT_DING,
  UPDATE_DING_DESCRIPTION,
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
    case REPORT_DING:
      return {
        ...state,
        ding: {
          ...state.ding,
          reports: action.ding.reports,
        },
      };
    case UPDATE_DING_DESCRIPTION:
      return {
        ...state,
        ding: {
          ...state.ding,
          description: action.ding,
        },
      };
  }
  return state;
};

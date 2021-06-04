import {
  POST_EVENT_COMMENT,
  EDIT_EVENT_COMMENT,
  LIKE_EVENT_COMMENT,
  UNLIKE_EVENT_COMMENT,
  REPORT_EVENT_COMMENT,
} from '../types';

const initialState = {
  comment: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POST_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case EDIT_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case LIKE_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case UNLIKE_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case REPORT_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
  }
  return state;
};

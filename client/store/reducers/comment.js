import {
  POST_COMMENT,
  EDIT_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  REPORT_COMMENT,
} from '../types';

const initialState = {
  comment: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case POST_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case EDIT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case LIKE_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case UNLIKE_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case REPORT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
  }
  return state;
};

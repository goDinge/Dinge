import { ActionTypes } from '../types';
import { EventCommentsActions } from '../interfaces';

const initialState = {
  comment: {},
};

export const eventCommentReducer = (
  state = initialState,
  action: EventCommentsActions
) => {
  switch (action.type) {
    case ActionTypes.POST_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.LIKE_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.UNLIKE_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.DELETE_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.EDIT_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.REPORT_EVENT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    default:
      return state;
  }
};

import { ActionTypes } from '../types';
import { CommentsActions } from '../interfaces';

const initialState = {
  comment: {},
};

export const commentReducer = (
  state = initialState,
  action: CommentsActions
) => {
  switch (action.type) {
    case ActionTypes.POST_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.LIKE_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.UNLIKE_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.DELETE_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    case ActionTypes.EDIT_COMMENT:
      return {
        ...state,
        comment: action.comment,
      };
    default:
      return state;
  }
};

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
    default:
      return state;
  }
};

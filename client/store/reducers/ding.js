import {
  GET_DING,
  LIKE_DING,
  UNLIKE_DING,
  REPORT_DING,
  POST_COMMENT,
  EDIT_COMMENT,
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
    case POST_COMMENT:
      return {
        ...state,
        ding: action.ding,
      };
    case EDIT_COMMENT: {
      const index = state.ding.comments.findIndex(
        (comment) => comment._id === action.editedComment._id
      );
      const newComments = [...state.ding.comments];
      newComments[index] = action.editedComment;

      return {
        ...state,
        ding: {
          ...state.ding,
          comments: newComments,
        },
      };
    }
  }
  return state;
};

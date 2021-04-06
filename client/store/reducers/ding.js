import { LIKE_DING, UNLIKE_DING } from '../types';

const initialState = {
  likesList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LIKE_DING:
      return {
        ...state,
        likesList: action.likesList,
      };
    case UNLIKE_DING:
      return {
        ...state,
        likesList: action.likesList,
      };
  }
  return state;
};
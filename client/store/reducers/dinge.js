import {
  GET_DINGE,
  GET_DING,
  POST_DING,
  LIKE_DING,
  UNLIKE_DING,
} from '../types';

const initialState = {
  dinge: [],
  newDing: {},
  likesList: [],
  ding: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DINGE:
      return {
        ...state,
        dinge: action.dinge,
      };
    case GET_DING:
      return {
        ...state,
        ding: action.ding,
      };

    case POST_DING:
      return {
        ...state,
        newDing: action.dinge,
      };
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

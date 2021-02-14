import { GET_DINGE, POST_DING } from '../types';

const initialState = {
  dinge: [],
  newDing: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DINGE:
      return {
        ...state,
        dinge: action.dinge,
      };
    case POST_DING:
      return {
        ...state,
        newDing: action.dinge,
      };
  }
  return state;
};

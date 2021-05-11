import { GET_DINGE, GET_DING, POST_DING, GET_LOCAL_DINGE } from '../types';

const initialState = {
  dinge: [],
  newDing: {},
  ding: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DINGE:
      return {
        ...state,
        dinge: action.dinge,
      };
    case GET_LOCAL_DINGE:
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
  }
  return state;
};

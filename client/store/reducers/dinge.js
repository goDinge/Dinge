import { GET_DINGE } from '../types';

const initialState = {
  dinge: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DINGE:
      return {
        ...state,
        dinge: action.dinge,
      };
  }
  return state;
};

import { ADD_DING_TO_FAV } from '../types';

const initialState = {
  ding: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_DING_TO_FAV:
      return {
        ...state,
        ding: action.ding,
      };
  }
  return state;
};

import { SET_MESSAGE, RESET_MESSAGE } from '../types';

const initialState = {
  message: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        message: action.message,
      };
    case RESET_MESSAGE:
      return {
        ...initialState,
      };
  }
  return state;
};

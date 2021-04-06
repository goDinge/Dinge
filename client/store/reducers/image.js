import { SET_IMAGE, RESET_IMAGE } from '../types';

const initialState = {
  image: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IMAGE:
      return {
        ...state,
        image: action.image,
      };
    case RESET_IMAGE:
      return {
        ...initialState,
      };
  }
  return state;
};

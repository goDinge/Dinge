import { SET_IMAGE, GET_IMAGE } from '../types';

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
  }
  return state;
};

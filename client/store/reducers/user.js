import { GET_USER, REMOVE_USER, UPDATE_USER_AVATAR } from '../types';

const initialState = {
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.user,
      };
    case UPDATE_USER_AVATAR: {
      return {
        ...state,
        user: action.user,
      };
    }
    case REMOVE_USER:
      return initialState;
  }
  return state;
};

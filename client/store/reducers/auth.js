import { AUTHENTICATE, SET_AUTH_USER, LOGOUT, SET_DID_TRY_AL } from '../types';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  authUser: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
        authUser: action.authUser,
      };
    case SET_AUTH_USER:
      return {
        ...state,
        authUser: action.authUser,
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true,
      };
    default:
      return state;
  }
};

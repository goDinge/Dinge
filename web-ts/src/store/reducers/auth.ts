import { AuthActionTypes, AuthState } from '../interfaces';
import { ActionTypes } from '../types';

const initialState: AuthState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  authUser: null,
  // authData: {
  //   name: '',
  //   email: '',
  //   password: '',
  // },
  veriCode: null,
  verified: false,
  newPassword: null,
};

export const authReducer = (
  state: AuthState = initialState,
  action: AuthActionTypes
) => {
  switch (action.type) {
    case ActionTypes.AUTHENTICATE:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
        authUser: action.authUser,
      };
    case ActionTypes.SET_AUTH_USER:
      return {
        ...state,
        authUser: action.authUser,
      };
    case ActionTypes.GET_AUTH_USER:
      return {
        ...state,
        authUser: action.authUser,
      };
    case ActionTypes.SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };
    case ActionTypes.GET_VERIFICATION_CODE:
      return {
        ...state,
        veriCode: action.veriCode,
      };
    case ActionTypes.CODE_VERIFIED:
      return {
        ...state,
        verified: action.verified,
      };
    case ActionTypes.SET_NEW_PASSWORD:
      return {
        ...state,
        newPassword: action.newPassword,
      };
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        authUser: null,
        didTryAutoLogin: false,
      };
    default:
      return state;
  }
};

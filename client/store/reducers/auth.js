import {
  AUTHENTICATE,
  SET_AUTH_USER,
  LOGOUT,
  SET_DID_TRY_AL,
  UPDATE_AUTH_AVATAR,
  GET_AUTH_USER,
  PROFILE_UPDATE_REDUX,
  PASSWORD_UPDATE_REDUX,
  GET_VERIFICATION_CODE,
  CODE_VERIFIED,
  SET_NEW_PASSWORD,
} from '../types';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  authUser: {},
  veriCode: '',
  verified: false,
  newPassword: false,
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
    case GET_AUTH_USER:
      return {
        ...state,
        authUser: action.authUser,
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };
    case UPDATE_AUTH_AVATAR:
      return {
        ...state,
        authUser: {
          ...state,
          avatar: action.authUser,
        },
      };
    case PROFILE_UPDATE_REDUX:
      return {
        ...state,
        authUser: action.authUser,
      };
    case PASSWORD_UPDATE_REDUX:
      return {
        ...state,
        authUser: action.authUser,
      };
    case GET_VERIFICATION_CODE:
      return {
        ...state,
        veriCode: action.veriCode,
      };
    case CODE_VERIFIED:
      return {
        ...state,
        verified: action.verified,
      };
    case SET_NEW_PASSWORD:
      return {
        ...state,
        newPassword: action.newPassword,
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: false,
      };
    default:
      return state;
  }
};

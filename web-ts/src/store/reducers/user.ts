import { UserActionTypes } from '../interfaces';
import { ActionTypes } from '../types';

const initialState = {
  user: {
    avatar: '',
    role: '',
    reputation: 0,
    level: '',
    status: '',
    facebook: '',
    following: [],
    followers: [],
    reports: [],
    _id: '',
    name: '',
    email: '',
    password: '',
    createdAt: '',
    lastLoginAt: '',
    lastModifiedAt: '',
    __v: '',
  },
};

export const userReducer = (state = initialState, action: UserActionTypes) => {
  switch (action.type) {
    case ActionTypes.GET_USER:
      return {
        ...state,
        user: action.user,
      };
    case ActionTypes.REMOVE_USER:
      return initialState;
    default:
      return state;
  }
};

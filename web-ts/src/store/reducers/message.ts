import { ActionTypes } from '../../store/types';
import { Action } from '../interfaces';

const initialState = {
  message: '',
};

export const messageReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case ActionTypes.RESET_MESSAGE:
      return {
        ...initialState,
      };
  }
};

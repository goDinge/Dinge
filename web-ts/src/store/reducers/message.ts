import { ActionTypes } from '../../store/types';
import { MessageActionTypes } from '../interfaces';

const initialState = {
  message: '',
  screen: '',
};

export const messageReducer = (
  state = initialState,
  action: MessageActionTypes
) => {
  switch (action.type) {
    case ActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: action.message,
        screen: action.screen,
      };
    case ActionTypes.RESET_MESSAGE:
      return initialState;
    default:
      return state;
  }
};

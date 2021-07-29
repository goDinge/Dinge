import { ActionTypes } from '../types';
import { Dispatch } from 'redux';
import { message } from '../interfaces';

export const setMessage = (message: message, screen: string) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.SET_MESSAGE,
      message: message,
      screen: screen,
    });
  };
};

export const resetMessage = () => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.RESET_MESSAGE,
      message: '',
      screen: '',
    });
  };
};

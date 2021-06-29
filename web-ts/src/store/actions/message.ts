import { ActionTypes } from '../types';
import { Dispatch } from 'redux';

export const setMessage = (message: string) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.SET_MESSAGE,
      message: message,
    });
  };
};

export const resetMessage = (message: string) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.RESET_MESSAGE,
      message: message,
    });
  };
};

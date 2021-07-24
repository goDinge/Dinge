import { ActionTypes } from '../types';
import { Dispatch } from 'redux';
import { message } from '../interfaces';

export const setMessage = (message: message) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.SET_MESSAGE,
      message: message,
    });
  };
};

export const resetMessage = () => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.RESET_MESSAGE,
      message: '',
    });
  };
};

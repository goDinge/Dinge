import { SET_MESSAGE, RESET_MESSAGE } from '../types';

export const setMessage = (message) => {
  return (dispatch) => {
    dispatch({
      type: SET_MESSAGE,
      message: message,
    });
  };
};

export const resetMessage = (message) => {
  return (dispatch) => {
    dispatch({
      type: RESET_MESSAGE,
      message: message,
    });
  };
};

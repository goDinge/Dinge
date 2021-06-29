import { v4 as uuidv4 } from 'uuid';
import { ActionTypes } from '../types';
import { Dispatch } from 'redux';

export const addMessage = (message: string, messageType: string) => {
  return (dispatch: Dispatch) => {
    const id = uuidv4();
    dispatch({
      type: ActionTypes.ADD_MESSAGE,
      message: {
        message,
        messageType,
        id,
      },
    });
  };
};

export const removeMessage = (message: string) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.REMOVE_MESSAGE,
      message: message,
    });
  };
};

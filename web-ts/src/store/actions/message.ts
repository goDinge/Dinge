import { v4 as uuidv4 } from 'uuid';
import { ActionTypes } from '../types';
import { Dispatch } from 'redux';

export const addMessage = (text: string, messageType: string) => {
  return (dispatch: Dispatch) => {
    const id = uuidv4();
    dispatch({
      type: ActionTypes.ADD_MESSAGE,
      message: {
        text,
        messageType,
        id,
      },
    });
    setTimeout(
      () => dispatch({ type: ActionTypes.REMOVE_MESSAGE, message: id }),
      5000
    );
  };
};

export const removeMessage = (id: string) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.REMOVE_MESSAGE,
      message: id,
    });
  };
};

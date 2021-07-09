import { ActionTypes } from '../../store/types';
import { MessageActionTypes, Message } from '../interfaces';

const initialState: Message[] = [];

export const messageReducer = (
  state: Message[] = initialState,
  action: MessageActionTypes
) => {
  switch (action.type) {
    case ActionTypes.ADD_MESSAGE:
      return [...state, action.message];
    case ActionTypes.REMOVE_MESSAGE:
      return state.filter((message) => message.id !== action.message);
    default:
      return state;
  }
};
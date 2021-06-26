import { ActionTypes } from '../types';
import { Action } from '../interfaces';

const initialState = {
  dinge: [],
  newDing: null,
  ding: {},
};

export const dingeReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.GET_DINGE:
      return {
        ...state,
        dinge: action.payload,
      };
    default:
      return state;
  }
};

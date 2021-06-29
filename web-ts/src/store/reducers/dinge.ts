import { ActionTypes } from '../types';
import { DingeActions } from '../interfaces';

const initialState = {
  dinge: [],
  newDing: null,
  ding: {},
};

export const dingeReducer = (state = initialState, action: DingeActions) => {
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

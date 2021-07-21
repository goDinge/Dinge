import { ActionTypes } from '../types';
import { DingActions } from '../interfaces';

const initialState = {
  ding: {},
};

export const dingReducer = (state = initialState, action: DingActions) => {
  switch (action.type) {
    case ActionTypes.GET_DING_BY_ID:
      return {
        ...state,
        ding: action.ding,
      };
    default:
      return state;
  }
};

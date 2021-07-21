import { ActionTypes } from '../types';
import { DingActions } from '../interfaces';

const initialState = {
  ding: null,
};

export const dingReducer = (state = initialState, action: DingActions) => {
  switch (action.type) {
    case ActionTypes.GET_DING_BY_ID:
      return {
        ...state,
        ding: action.ding,
      };
    case ActionTypes.REMOVE_DING:
      return initialState;
    default:
      return state;
  }
};

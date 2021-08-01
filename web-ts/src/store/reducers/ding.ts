import { ActionTypes } from '../types';
import { dingState, DingActions } from '../interfaces';

const initialState: dingState = {
  ding: {
    description: '',
    _id: '',
    likes: [],
    comments: [],
    reports: [],
    user: '',
    location: {
      longitude: 0,
      latitude: 0,
    },
    thumbUrl: '',
    imgUrl: '',
    createdAt: new Date(),
    lastModifiedAt: new Date(),
  },
};

export const dingReducer = (state = initialState, action: DingActions) => {
  switch (action.type) {
    case ActionTypes.GET_DING_BY_ID:
      return {
        ...state,
        ding: action.ding,
      };
    case ActionTypes.LIKE_DING:
      return {
        ...state,
        ding: {
          ...state.ding,
          likes: action.ding.likes,
        },
      };
    case ActionTypes.UNLIKE_DING:
      return {
        ...state,
        ding: {
          ...state.ding,
          likes: action.ding.likes,
        },
      };
    case ActionTypes.REMOVE_DING:
      return initialState;
    case ActionTypes.REPORT_DING:
      return {
        ...state,
        ding: {
          ...state.ding,
          reports: action.ding.reports,
        },
      };
    case ActionTypes.UPDATE_DING_DESCRIPTION:
      return {
        ...state,
        ding: {
          ...state.ding,
          description: action.ding,
        },
      };
    default:
      return state;
  }
};

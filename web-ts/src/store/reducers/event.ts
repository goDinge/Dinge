import { ActionTypes } from '../types';
import { eventState, EventActions } from '../interfaces';

const initialState: eventState = {
  event: {
    description: '',
    _id: '',
    eventName: '',
    likes: [],
    comments: [],
    reports: [],
    user: '',
    address: '',
    eventPic: '',
    eventType: '',
    location: {
      longitude: 0,
      latitude: 0,
    },
    thumbUrl: '',
    imgUrl: '',
    date: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    lastModifiedAt: new Date(),
  },
};

export const eventReducer = (state = initialState, action: EventActions) => {
  switch (action.type) {
    case ActionTypes.GET_EVENT_BY_ID:
      return {
        ...state,
        event: action.event,
      };
    case ActionTypes.LIKE_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          likes: action.event.likes,
        },
      };
    case ActionTypes.UNLIKE_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          likes: action.event.likes,
        },
      };
    case ActionTypes.REMOVE_EVENT:
      return initialState;
    case ActionTypes.REPORT_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          reports: action.event.reports,
        },
      };
    default:
      return state;
  }
};

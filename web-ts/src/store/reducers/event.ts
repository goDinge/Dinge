import { ActionTypes } from '../types';
import { eventState, EventActions } from '../interfaces';

const initialState: eventState = {
  event: {
    description: '',
    _id: '',
    likes: [],
    comments: [],
    reports: [],
    user: '',
    address: '',
    eventPic: '',
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
    case ActionTypes.REMOVE_EVENT:
      return initialState;
    default:
      return state;
  }
};

import { LocationActions } from '../interfaces';
import { ActionTypes } from '../types';

const initialState = {
  location: {
    coords: {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      latitude: 0,
      longitude: 0,
      speed: 0,
    },
  },
};

//GeolocationPosition

export const locationReducer = (
  state = initialState,
  action: LocationActions
) => {
  switch (action.type) {
    case ActionTypes.SET_LOCATION:
      return {
        ...state,
        location: action.location,
      };
    default:
      return state;
  }
};

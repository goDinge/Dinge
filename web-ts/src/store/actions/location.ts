import { ActionTypes } from '../types';
import { Dispatch } from 'redux';
//import { location } from '../interfaces';

export const setLocation = (location: GeolocationPosition) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ActionTypes.SET_LOCATION,
      location: location,
    });
  };
};

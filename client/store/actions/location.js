import { SET_LOCATION } from '../types';

export const setLocation = (location) => {
  return (dispatch) => {
    dispatch({
      type: SET_LOCATION,
      location: location,
    });
  };
};

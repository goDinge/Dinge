import { SET_IMAGE, RESET_IMAGE } from '../types';

export const setImage = (image) => {
  return (dispatch) => {
    dispatch({
      type: SET_IMAGE,
      image: image,
    });
  };
};

export const resetImage = (image) => {
  return (dispatch) => {
    dispatch({
      type: RESET_IMAGE,
      image: image,
    });
  };
};

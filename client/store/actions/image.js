import { SET_IMAGE, GET_IMAGE } from '../types';

export const setImage = (image) => {
  return (dispatch) => {
    dispatch({
      type: SET_IMAGE,
      image: image,
    });
  };
};

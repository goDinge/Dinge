import axios from 'axios';
import { LIKE_DING, UNLIKE_DING } from '../types';
import { HOME_IP } from '@env';

export const likeDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `http://${HOME_IP}/api/ding/likes/${dingId}`
      );
      const likesList = response.data.data.likes;

      dispatch({
        type: LIKE_DING,
        likesList: likesList,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `http://${HOME_IP}/api/ding/likes/${dingId}`
      );
      const likesList = response.data.data.likes;

      dispatch({
        type: UNLIKE_DING,
        likesList: likesList,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

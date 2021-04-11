import axios from 'axios';
import { LIKE_DING, UNLIKE_DING, GET_DING } from '../types';
import { HOME_IP } from '@env';

export const getDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://${HOME_IP}/api/dinge/${dingId}`);
      const ding = response.data.data;

      dispatch({
        type: GET_DING,
        ding: ding,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const likeDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `http://${HOME_IP}/api/ding/likes/${dingId}`
      );
      const ding = response.data.data;
      console.log('like hit');

      dispatch({
        type: LIKE_DING,
        ding: ding,
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
      const ding = response.data.data;

      dispatch({
        type: UNLIKE_DING,
        ding: ding,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

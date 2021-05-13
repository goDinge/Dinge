import axios from 'axios';
import {
  LIKE_DING,
  UNLIKE_DING,
  GET_DING,
  REPORT_DING,
  POST_COMMENT,
  UPDATE_DING_LOCATION,
} from '../types';
import { HOME_IP } from '@env';

export const getDing = (dingId) => {
  return async (dispatch) => {
    try {
      console.log('ding action - IP used:', HOME_IP);
      const response = await axios.get(`${HOME_IP}/api/dinge/${dingId}`);
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
//need to be more specific about updating the proper slice of ding
export const likeDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${HOME_IP}/api/ding/likes/${dingId}`);
      const ding = response.data.data;

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
        `${HOME_IP}/api/ding/likes/${dingId}`
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

export const updateDingLocation = (dingId, location) => {
  return async (dispatch) => {
    try {
      console.log('ding action - IP used:', HOME_IP);

      const response = await axios.put(
        `${HOME_IP}/api/ding/${dingId}/location?longitude=${location.longitude}&latitude=${location.latitude}`
      );

      const newLocation = response.data.data.location;
      dispatch({
        type: UPDATE_DING_LOCATION,
        ding: newLocation,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const reportDingById = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${HOME_IP}/api/ding/reports/${dingId}`);
      const ding = response.data.data;

      dispatch({
        type: REPORT_DING,
        ding: ding,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const postComment = (text, dingId) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.post(
        `${HOME_IP}/api/comments/${dingId}`,
        body,
        config
      );
      const ding = response.data.data;

      dispatch({
        type: POST_COMMENT,
        ding: ding,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

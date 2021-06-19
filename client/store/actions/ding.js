import axios from 'axios';
import {
  LIKE_DING,
  UNLIKE_DING,
  GET_DING,
  REPORT_DING,
  UPDATE_DING_DESCRIPTION,
} from '../types';
import { CURRENT_IP } from '../../serverConfigs.js';

export const getDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/dinge/${dingId}`);
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
        `${CURRENT_IP}/api/ding/likes/${dingId}`
      );
      const ding = response.data.data;

      dispatch({
        type: LIKE_DING,
        ding: ding,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${CURRENT_IP}/api/ding/likes/${dingId}`
      );
      const ding = response.data.data;

      dispatch({
        type: UNLIKE_DING,
        ding: ding,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const reportDingById = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/ding/reports/${dingId}`
      );
      const ding = response.data.data;

      dispatch({
        type: REPORT_DING,
        ding: ding,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const updateDingDescription = (text, dingId) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.put(
        `${CURRENT_IP}/api/ding/${dingId}`,
        body,
        config
      );
      const description = response.data.data;

      dispatch({
        type: UPDATE_DING_DESCRIPTION,
        ding: description,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

import axios from 'axios';
import { GET_EVENT, LIKE_EVENT, UNLIKE_EVENT, REPORT_EVENT } from '../types';
import { HOME_IP } from '@env';

export const getEvent = (id) => {
  return async (dispatch) => {
    try {
      console.log('event action - IP used:  ', HOME_IP);

      const response = await axios.get(`${HOME_IP}/api/events/${id}`);
      const event = response.data.data;

      dispatch({
        type: GET_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const likeEvent = (eventId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${HOME_IP}/api/event/likes/${eventId}`);
      const event = response.data.data;

      dispatch({
        type: LIKE_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeEvent = (eventId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${HOME_IP}/api/event/likes/${eventId}`
      );
      const event = response.data.data;

      dispatch({
        type: UNLIKE_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const reportEventById = (eventId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${HOME_IP}/api/event/reports/${eventId}`
      );
      const event = response.data.data;

      dispatch({
        type: REPORT_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

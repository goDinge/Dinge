import axios from 'axios';
import { GET_EVENTS } from '../types';
import { HOME_IP } from '@env';

export const getEvents = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://${HOME_IP}/api/events`);
      const events = response.data.data;

      dispatch({
        type: GET_EVENTS,
        events: events,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

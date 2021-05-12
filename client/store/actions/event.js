import axios from 'axios';
import { GET_EVENT } from '../types';
import { HOME_IP } from '@env';

export const getEvent = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://${HOME_IP}/api/events/${id}`);
      const event = response.data.data;

      dispatch({
        type: GET_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again. ');
    }
  };
};

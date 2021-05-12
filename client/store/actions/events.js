import axios from 'axios';
import { GET_EVENTS, CREATE_EVENT } from '../types';
import { HOME_IP } from '@env';

export const getEvents = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${HOME_IP}/api/events`);
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

export const createEvent = (formState) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const {
      eventName,
      date,
      eventType,
      thumbUrl,
      address,
      location,
      description,
      hours,
    } = formState.inputValues;

    const body = JSON.stringify({
      eventName,
      date,
      eventType,
      thumbUrl,
      address,
      location,
      description,
      hours,
    });
    try {
      const response = await axios.post(`${HOME_IP}/api/events`, body, config);
      const event = response.data.data;

      dispatch({
        type: CREATE_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

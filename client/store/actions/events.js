import axios from 'axios';
import {
  GET_AUTH_EVENTS,
  GET_LOCAL_EVENTS,
  CREATE_EVENT,
  UPDATE_EVENT_LOCATION,
  DELETE_EVENT,
} from '../types';
import { HOME_IP } from '@env';

const settingConfigs = require('../../settingConfigs.json');

export const getEventsByAuth = () => {
  return async (dispatch) => {
    try {
      console.log('events action - IP used:', HOME_IP);

      const response = await axios.get(`${HOME_IP}/api/events/authUser`);
      const events = response.data.data;

      dispatch({
        type: GET_AUTH_EVENTS,
        events: events,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again. ');
    }
  };
};

export const getLocalEvents = (location) => {
  return async (dispatch) => {
    try {
      console.log('getLocalEvents action - IP used: ', HOME_IP);
      const distance = settingConfigs[0].radius;

      const response = await axios.get(
        `${HOME_IP}/api/events/local/${distance}/location?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
      );
      const events = response.data.data;

      dispatch({
        type: GET_LOCAL_EVENTS,
        events: events,
      });
    } catch (err) {
      throw new Error(
        'Local events - Cannot connect with server. Please try again.'
      );
    }
  };
};

export const updateEventLocation = (eventId, location) => {
  return async (dispatch) => {
    try {
      console.log('event action - IP used:', HOME_IP);

      const response = await axios.put(
        `${HOME_IP}/api/event/${eventId}/location?longitude=${location.longitude}&latitude=${location.latitude}`
      );

      const updatedEvent = response.data.data;
      dispatch({
        type: UPDATE_EVENT_LOCATION,
        payload: updatedEvent,
      });
    } catch (err) {
      console.log(err.message);
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
      description,
      hours,
    } = formState.inputValues;

    let location = formState.inputValues.location;
    location = {
      longitude: location.longitude,
      latitude: location.latitude,
    };

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

export const deleteEventById = (eventId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${HOME_IP}/api/events/${eventId}`);
      const events = response.data.data;

      dispatch({
        type: GET_LOCAL_EVENTS,
        events: events,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error(
        'Delete event - Cannot connect with server. Please try again.'
      );
    }
  };
};

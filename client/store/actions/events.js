import axios from 'axios';
import {
  GET_AUTH_EVENTS,
  GET_LOCAL_EVENTS,
  CREATE_EVENT,
  UPDATE_EVENT_LOCATION,
} from '../types';
import { CURRENT_IP } from '../../serverConfigs.js';

const settingConfigs = require('../../settingConfigs.json');

export const getEventsByAuth = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/events/authUser`);
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
      console.log('getLocalEvents action - IP used: ', CURRENT_IP);
      const distance = settingConfigs[0].radius;

      const response = await axios.get(
        `${CURRENT_IP}/api/events/local/${distance}/location?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
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
      const response = await axios.put(
        `${CURRENT_IP}/api/event/${eventId}/location?longitude=${location.longitude}&latitude=${location.latitude}`
      );

      const updatedEvent = response.data.data;
      dispatch({
        type: UPDATE_EVENT_LOCATION,
        payload: updatedEvent,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const createEvent = (formState) => {
  return async (dispatch) => {
    const {
      eventName,
      date,
      eventType,
      eventPic,
      thumbUrl,
      address,
      description,
      hours,
      location,
    } = formState.inputValues;

    const eventPicName = eventPic.uri.split('/').pop();

    let formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('date', JSON.stringify(date));
    formData.append('eventType', eventType);
    formData.append('thumbUrl', thumbUrl);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('hours', hours);
    formData.append('location[longitude]', JSON.stringify(location.longitude));
    formData.append('location[latitude]', JSON.stringify(location.latitude));
    formData.append('eventPic', {
      uri: `file://${eventPic.uri}`,
      type: 'image/jpg',
      name: `${eventPicName}`,
    });

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/events`,
        formData,
        config
      );
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
      const response = await axios.delete(
        `${CURRENT_IP}/api/events/${eventId}`
      );
      const events = response.data.data;

      dispatch({
        type: GET_LOCAL_EVENTS,
        events: events,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

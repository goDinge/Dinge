import axios from 'axios';
import {
  GET_EVENT,
  UPDATE_EVENT,
  LIKE_EVENT,
  UNLIKE_EVENT,
  REPORT_EVENT,
} from '../types';
import { CURRENT_IP } from '../../serverConfigs.js';

export const getEvent = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/events/${id}`);
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

export const updateEvent = (formState, eventId) => {
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

    let eventPicName;
    let eventPicURI;

    if (eventPic.hasOwnProperty('uri')) {
      eventPicName = eventPic.uri.split('/').pop();
      eventPicURI = `file://${eventPic.uri}`;
    } else {
      eventPicName = eventPic.split('/').pop();
      eventPicURI = eventPic;
    }

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
      uri: `${eventPicURI}`,
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
      const response = await axios.put(
        `${CURRENT_IP}/api/event/${eventId}`,
        formData,
        config
      );
      const event = response.data.data;

      dispatch({
        type: UPDATE_EVENT,
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
      const response = await axios.put(
        `${CURRENT_IP}/api/event/likes/${eventId}`
      );
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
        `${CURRENT_IP}/api/event/likes/${eventId}`
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
        `${CURRENT_IP}/api/event/reports/${eventId}`
      );
      const event = response.data.data;

      dispatch({
        type: REPORT_EVENT,
        event: event,
      });
    } catch (err) {
      if (!err.response) {
        throw new Error('Cannot connect with server. Please try again.');
      } else {
        throw new Error(err.response.data);
      }
    }
  };
};

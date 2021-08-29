import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import {
  events_data,
  Get_Local_Events,
  eventType,
  eventFormData,
} from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

const settingConfigs = require('../../settingConfigs.json');

export const createEvent = (
  date: Date | null,
  eventPic: any,
  formDataProp: eventFormData,
  eventTypeProp: eventType,
  locationData: any
) => {
  return async (dispatch: Dispatch) => {
    const { eventName, hours, address, description } = formDataProp;
    const { type, thumbUrl } = eventTypeProp;

    const picNameTimeStamp = Date.now().toString();

    const eventPicName =
      eventPic.name.split('.')[0] +
      '-' +
      picNameTimeStamp +
      '.' +
      eventPic.name.split('.')[1];
    const eventPicFile = new Blob([eventPic], {
      type: 'image/jpg',
    });

    let formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('date', JSON.stringify(date));
    formData.append('eventType', type);
    formData.append('thumbUrl', thumbUrl);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('hours', hours);
    formData.append(
      'location[longitude]',
      JSON.stringify(locationData[0].geometry.location.lng)
    );
    formData.append(
      'location[latitude]',
      JSON.stringify(locationData[0].geometry.location.lat)
    );
    formData.append('eventPic', eventPicFile, eventPicName);

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
        type: ActionTypes.CREATE_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error(
        'Cannot connect with server while creating event. Please try again.'
      );
    }
  };
};

export const getLocalEvents = (location: GeolocationPosition) => {
  return async (dispatch: Dispatch) => {
    try {
      const distance: number = settingConfigs[0].radius;

      const response = await axios.get<events_data>(
        `${CURRENT_IP}/api/events/local/${distance}/location?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
      );
      const events = response.data.data;

      dispatch<Get_Local_Events>({
        type: ActionTypes.GET_LOCAL_EVENTS,
        events: events,
      });
    } catch (err) {
      throw new Error(
        'Cannot connect with server while locating you. Please try again.'
      );
    }
  };
};

export const deleteEventById = (eventId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      await axios.delete<events_data>(`${CURRENT_IP}/api/events/${eventId}`);

      dispatch({
        type: ActionTypes.DELETE_EVENT_BY_ID,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

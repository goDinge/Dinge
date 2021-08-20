import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import { events_data, Get_Local_Events } from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

const settingConfigs = require('../../settingConfigs.json');

export const createEvent = (
  date: Date | null,
  eventPic: any,
  formDataProp: any,
  eventTypeProp: any,
  location: any
) => {
  return async (dispatch: Dispatch) => {
    const { eventType, thumbUrl } = eventTypeProp;
    const { eventName, hours, address, description } = formDataProp;
    // const {
    //   eventName,
    //   date,
    //   eventType,
    //   eventPic,
    //   thumbUrl,
    //   address,
    //   description,
    //   hours,
    //   location,
    // } = formState.inputValues;

    const eventPicName = eventPic.name;
    console.log('eventPic: ', eventPic);
    const eventPicFile = new Blob([eventPic], {
      type: 'image/jpg',
    });
    // const eventPicFile = new File([`file://${eventPic}`], `${eventPicName}`, {
    //   type: 'image/jpg',
    // });

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
      throw new Error('Cannot connect with server. Please try again.');
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
      throw new Error('Cannot connect with server. Please try again.');
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

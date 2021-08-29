import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import {
  Get_Event_By_Id,
  Remove_Event,
  event_data,
  Like_Event,
  Unlike_Event,
  Report_Event,
  eventType,
  eventFormData,
} from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

export const getEventById = (eventId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get<event_data>(
        `${CURRENT_IP}/api/events/${eventId}`
      );
      const event = response.data.data;

      dispatch<Get_Event_By_Id>({
        type: ActionTypes.GET_EVENT_BY_ID,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const updateEvent = (
  date: Date | null,
  eventPic: any,
  formDataProp: eventFormData,
  eventTypeProp: eventType,
  locationData: any,
  eventId: string,
  newPicIndicator: boolean,
  newLocationIndicator: boolean,
  prevLocationData: any
) => {
  return async (dispatch: Dispatch) => {
    const { eventName, hours, address, description } = formDataProp;
    const { type, thumbUrl } = eventTypeProp;

    const picNameTimeStamp = Date.now().toString();

    let eventPicName: string | undefined;
    let eventPicFile: string | Blob = new Blob([''], {
      type: 'image/jpg',
    });

    if (newPicIndicator) {
      eventPicName =
        eventPic.name.split('.')[0] +
        '-' +
        picNameTimeStamp +
        '.' +
        eventPic.name.split('.')[1];
      eventPicFile = new Blob([eventPic], {
        type: 'image/jpg',
      });
    }

    let latitude = 0;
    let longitude = 0;

    if (newLocationIndicator) {
      latitude = locationData[0].geometry.location.lat;
      longitude = locationData[0].geometry.location.lng;
    } else {
      latitude = prevLocationData.lat;
      longitude = prevLocationData.lng;
    }

    let formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('date', JSON.stringify(date));
    formData.append('eventType', type);
    formData.append('thumbUrl', thumbUrl);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('hours', hours);
    formData.append('location[longitude]', JSON.stringify(longitude));
    formData.append('location[latitude]', JSON.stringify(latitude));
    formData.append('eventPic', eventPicFile, eventPicName);

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
        type: ActionTypes.UPDATE_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error(
        'Cannot connect with server while updating event. Please try again.'
      );
    }
  };
};

export const removeEvent = () => {
  return (dispatch: Dispatch) => {
    dispatch<Remove_Event>({
      type: ActionTypes.REMOVE_EVENT,
      event: {},
    });
  };
};

export const likeEvent = (eventId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put<event_data>(
        `${CURRENT_IP}/api/event/likes/${eventId}`
      );
      const event = response.data.data;

      dispatch<Like_Event>({
        type: ActionTypes.LIKE_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeEvent = (eventId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.delete<event_data>(
        `${CURRENT_IP}/api/event/likes/${eventId}`
      );
      const event = response.data.data;

      dispatch<Unlike_Event>({
        type: ActionTypes.UNLIKE_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const reportEventById = (eventId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put<event_data>(
        `${CURRENT_IP}/api/event/reports/${eventId}`
      );
      const event = response.data.data;

      dispatch<Report_Event>({
        type: ActionTypes.REPORT_EVENT,
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

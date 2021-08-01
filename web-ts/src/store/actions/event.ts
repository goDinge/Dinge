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

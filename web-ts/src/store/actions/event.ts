import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import { Get_Event_By_Id, Remove_Event, event_data } from '../interfaces';
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

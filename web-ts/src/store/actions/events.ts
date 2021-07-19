import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import { events_data, Get_Local_Events } from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

const settingConfigs = require('../../settingConfigs.json');

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
      throw new Error('Events. Cannot connect with server. Please try again.');
    }
  };
};

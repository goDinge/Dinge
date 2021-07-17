import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import { Get_Dinge, dinge_data, Get_Local_Dinge } from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

const settingConfigs = require('../../settingConfigs.json');

//this should only be used by admin
export const getDinge = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get<dinge_data>(`${CURRENT_IP}/api/dinge`);
      const dinge = response.data.data;

      dispatch<Get_Dinge>({
        type: ActionTypes.GET_DINGE,
        dinge: dinge,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const getLocalDinge = (location: GeolocationPosition) => {
  return async (dispatch: Dispatch) => {
    try {
      const distance = settingConfigs[0].radius;
      const response = await axios.get<dinge_data>(
        `${CURRENT_IP}/api/dinge/local/${distance}/location?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
      );
      const dinge = response.data.data;
      console.log('dinge action');

      dispatch<Get_Local_Dinge>({
        type: ActionTypes.GET_LOCAL_DINGE,
        dinge: dinge,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again. ');
    }
  };
};

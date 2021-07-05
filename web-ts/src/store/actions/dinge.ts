import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import { Get_Dinge, dinge_data } from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

//this should only be used by admin
export const getDinge = () => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get<dinge_data>(`${CURRENT_IP}/api/dinge`);
      const dinge = response.data.data;

      dispatch<Get_Dinge>({
        type: ActionTypes.GET_DINGE,
        payload: dinge,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

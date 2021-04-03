import axios from 'axios';
import { ADD_DING_TO_FAV } from '../types';
import { HOME_IP } from '@env';

export const addDingToFav = (dingId) => {
  return async (dispatch) => {
    try {
      console.log(dingId);

      const response = await axios.put(`http://${HOME_IP}/api/ding/${dingId}`);
      const ding = response.data.data;

      dispatch({
        type: ADD_DING_TO_FAV,
        ding: ding,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

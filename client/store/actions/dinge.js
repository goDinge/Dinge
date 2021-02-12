import axios from 'axios';
import { GET_DINGE } from '../types';

export const getDinge = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://192.168.0.197:5000/api/dinge');
      const dingeAll = response.data.data;

      dispatch({
        type: GET_DINGE,
        dinge: dingeAll,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

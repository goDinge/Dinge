import axios from 'axios';
import { GET_USER } from '../types';
import { HOME_IP } from '@env';

export const getUser = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://${HOME_IP}/api/users/${userId}`);
      const user = response.data.data;

      dispatch({
        type: GET_USER,
        user: user,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};
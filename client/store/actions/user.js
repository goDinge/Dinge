import axios from 'axios';
import { GET_USER, REMOVE_USER } from '../types';
import { CURRENT_IP } from '../../serverConfigs.js';

export const getUser = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/users/${userId}`);
      const user = response.data.data;

      dispatch({
        type: GET_USER,
        user: user,
      });
    } catch (err) {
      throw new Error('Cannot retrieve user. Please try again.');
    }
  };
};

export const removeUser = () => {
  return (dispatch) => {
    dispatch({
      type: REMOVE_USER,
      user: {},
    });
  };
};

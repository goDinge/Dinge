import axios from 'axios';
import { GET_USER, UPDATE_USER_AVATAR } from '../types';
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

export const updateCurrentUserAvatar = (avatar) => {
  return async (dispatch) => {
    try {
      const body = JSON.stringify({ avatar });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.put(
        `http://${HOME_IP}/api/auth/me`,
        body,
        config
      );

      const newAvatar = response.data.data;
      console.log('newAvatar', newAvatar);

      dispatch({
        type: UPDATE_USER_AVATAR,
        user: newAvatar,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

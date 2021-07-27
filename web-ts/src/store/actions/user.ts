import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { Remove_User, userData } from '../interfaces';
import { ActionTypes } from '../types';
import { CURRENT_IP } from '../../serverConfigs';

export const getUser = (userId: string) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse<userData> = await axios.get(
        `${CURRENT_IP}/api/users/${userId}`
      );
      const user = response.data.data;

      dispatch({
        type: ActionTypes.GET_USER,
        user: user,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const removeUser = () => {
  return (dispatch: Dispatch) => {
    dispatch<Remove_User>({
      type: ActionTypes.REMOVE_USER,
      user: {},
    });
  };
};

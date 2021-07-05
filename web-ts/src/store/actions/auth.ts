import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { user, userObj } from '../interfaces';
import { ActionTypes } from '../types';
import { CURRENT_IP } from '../../serverConfigs';

let timer: null | ReturnType<typeof setTimeout> = null;
const oneMonth = 30 * 24 * 60 * 60 * 1000;

export const setAuthUser = (resData: user) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: ActionTypes.SET_AUTH_USER,
      authUser: resData,
    });
  };
};

// Access-Control-Allow-Origin:  http://127.0.0.1:3000
// Access-Control-Allow-Methods: POST
// Access-Control-Allow-Headers: Content-Type, Authorization

export const register = (name: string, email: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ name, email, password });

    try {
      const response: AxiosResponse<userObj> = await axios.post(
        `${CURRENT_IP}/api/auth/`,
        body,
        config
      );

      const result = response.data;
      await dispatch(
        authenticate(result.token, result.user._id, oneMonth, result.user)
      );
      // const expirationDate = result.options.expires;
      // await saveDataToStorage(
      //   result.token,
      //   result.user._id,
      //   expirationDate,
      //   result.user
      // );
      await dispatch(setAuthUser(result.user));
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const authenticate = (
  token: string,
  userId: string,
  expiryTime: number,
  result: user
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: ActionTypes.AUTHENTICATE, token, userId });
    dispatch({ type: ActionTypes.SET_AUTH_USER, authUser: result });
  };
};

export const logout = () => {
  clearLogoutTimer();
  //AsyncStorage.removeItem('userData');
  return { type: ActionTypes.LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime: number) => {
  return (dispatch: Dispatch<any>) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

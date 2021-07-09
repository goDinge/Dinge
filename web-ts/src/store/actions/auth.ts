import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import { user, userObj } from '../interfaces';
import { ActionTypes } from '../types';
import { CURRENT_IP } from '../../serverConfigs';
import { setAuthToken } from '../../helpers/setAuthToken';

let timer: null | ReturnType<typeof setTimeout> = null;
const twentyOneDays = 21 * 24 * 60 * 60 * 1000;

export const loadUser: any = () => {
  return async (dispatch: Dispatch<any>) => {
    if (localStorage.userData) {
      const data = JSON.parse(localStorage.userData);
      console.log('auth actions: ', data.token);
      setAuthToken(data.token);
    }

    try {
      const response: AxiosResponse<userObj> = await axios.get(
        `${CURRENT_IP}/api/auth/me`
      );
      if (!response) {
        throw new Error('You are not logged in.');
      }

      const user = response.data;

      await dispatch({
        type: ActionTypes.LOAD_USER,
        authUser: user,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const getAuthUser = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response: AxiosResponse<userObj> = await axios.get(
        `${CURRENT_IP}/api/auth/me`
      );
      if (!response) {
        throw new Error('You are not logged in.');
      }

      const user = response.data;

      await dispatch({
        type: ActionTypes.GET_AUTH_USER,
        authUser: user,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const setAuthUser = (resData: user) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: ActionTypes.SET_AUTH_USER,
      authUser: resData,
    });
  };
};

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
        authenticate(result.token, result.user._id, twentyOneDays, result.user)
      );
      const expirationDate = result.options.expires;
      await saveDataToStorage(
        result.token,
        result.user._id,
        expirationDate,
        result.user
      );
      await dispatch(setAuthUser(result.user));
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<any>) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });

    try {
      const response: AxiosResponse<userObj> = await axios.post(
        `${CURRENT_IP}/api/auth/login`,
        body,
        config
      );
      const resData = response.data;
      await dispatch(
        authenticate(
          resData.token,
          resData.user._id,
          twentyOneDays,
          resData.user
        )
      );
      const expirationDate = resData.options.expires;
      await saveDataToStorage(
        resData.token,
        resData.user._id,
        expirationDate,
        resData.user
      );
      await dispatch(setAuthUser(resData.user));
    } catch (err) {
      throw new Error(err.response.data.error);
    }
  };
};

export const logout = () => {
  clearLogoutTimer();
  localStorage.removeItem('userData');
  return { type: ActionTypes.LOGOUT };
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

const saveDataToStorage = (
  token: string,
  userId: string,
  expirationDate: string,
  user: user
) => {
  localStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate,
      authUser: user,
    })
  );
};

export const setDidTryAL = () => {
  return { type: ActionTypes.SET_DID_TRY_AL };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

export const setLogoutTimer = (expirationTime: number) => {
  return (dispatch: Dispatch<any>) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};
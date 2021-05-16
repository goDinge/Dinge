import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTHENTICATE,
  SET_AUTH_USER,
  GET_AUTH_USER,
  SET_DID_TRY_AL,
  LOGOUT,
} from '../types';
import { HOME_IP } from '@env';

let timer;
const oneMonth = 30 * 24 * 60 * 60 * 1000;

export const authenticate = (token, userId, expiryTime, resData) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token, userId });
    dispatch({ type: SET_AUTH_USER, authUser: resData });
  };
};

export const setAuthUser = (resData) => {
  return (dispatch) => {
    dispatch({
      type: SET_AUTH_USER,
      authUser: resData,
    });
  };
};

export const getAuthUser = () => {
  return async (dispatch) => {
    try {
      console.log('auth action - IP used:', HOME_IP);
      const response = await axios.get(`${HOME_IP}/api/auth/me`);
      if (!response) {
        throw new Error('You are not logged in.  ');
      }

      const user = response.data.data;

      await dispatch({
        type: GET_AUTH_USER,
        authUser: user,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const updateAuthAvatar = (avatar) => {
  return async (dispatch) => {
    try {
      const avatarName = avatar.uri.split('/').pop();
      const formData = new FormData();

      formData.append('avatar', {
        uri: `file://${avatar.uri}`,
        type: 'image/jpg',
        name: `${avatarName}`,
      });

      const config = {
        headers: {
          'Content-Type': 'form-data',
        },
      };
      const response = await axios.put(
        `${HOME_IP}/api/users/me`,
        formData,
        config
      );

      const newAvatar = response.data.data;
      console.log('newAvatar', newAvatar.avatar);
      await dispatch(setAuthUser(newAvatar));
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const register = (name, email, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ name, email, password });

    try {
      const response = await axios.post(`${HOME_IP}/api/auth/`, body, config);

      const resData = response.data;
      await dispatch(
        authenticate(resData.token, resData.user._id, oneMonth, resData.user)
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
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });

    try {
      const response = await axios.post(
        `${HOME_IP}/api/auth/login`,
        body,
        config
      );
      const resData = response.data;
      await dispatch(
        authenticate(resData.token, resData.user._id, oneMonth, resData.user)
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
      throw new Error('Cannot connect with server. Please try again. ');
    }
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

/** UTILS */
const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate, resData) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate,
      authUser: resData,
    })
  );
};

import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import {
  user,
  userObj,
  userData,
  profileObj,
  passwordObj,
} from '../interfaces';
import { ActionTypes } from '../types';
import { CURRENT_IP } from '../../serverConfigs';
import { setAuthToken } from '../../helpers/setAuthToken';

let timer: null | ReturnType<typeof setTimeout> = null;
const twentyOneDays = 21 * 24 * 60 * 60 * 1000;

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
    } catch (err: any) {
      throw new Error(err.response.data.error);
    }
  };
};

export const changePassword = (password: passwordObj) => {
  return async () => {
    const { oldPassword, newPassword, confirmNewPassword } = password;

    if (newPassword !== confirmNewPassword) {
      return new Error(
        'Please check your new password fields to make sure they are the same.'
      );
    }

    const body = JSON.stringify({ oldPassword, newPassword });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.put(`${CURRENT_IP}/api/auth/password`, body, config);
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const updateProfile = (profile: profileObj) => {
  return async (dispatch: Dispatch<any>) => {
    const { name, email, website, facebook } = profile;

    const body = JSON.stringify({
      name,
      email,
      website,
      facebook,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/auth/me`,
        body,
        config
      );
      const profile: user = response.data.data.user;

      dispatch({
        type: ActionTypes.PROFILE_UPDATE,
        authUser: profile,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const updateAuthAvatar = (avatar: any) => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const avatarName = avatar.name;
      const avatarFile = new Blob([avatar], {
        type: 'image/jpg',
      });
      let formData = new FormData();

      formData.append('avatar', avatarFile, avatarName);

      const config = {
        headers: {
          'Content-Type': 'form-data',
        },
      };
      const response = await axios.put(
        `${CURRENT_IP}/api/users/me`,
        formData,
        config
      );

      const newAvatar = response.data.data;

      await dispatch(setAuthUser(newAvatar)); //essentially setting new user profile - could improve
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const getAuthUser: any = () => {
  return async (dispatch: Dispatch<any>) => {
    if (localStorage.userData) {
      const data = JSON.parse(localStorage.userData);
      setAuthToken(data.token);
    }

    try {
      const response: AxiosResponse<userData> = await axios.get(
        `${CURRENT_IP}/api/auth/me`
      );
      if (!response) {
        throw new Error('You are not logged in.');
      }

      const user = response.data.data;

      const storageData: any = localStorage.getItem('userData');
      const storageDataTransformed: any = JSON.parse(storageData);
      const { token, userId } = storageDataTransformed;

      await dispatch({
        type: ActionTypes.GET_AUTH_USER,
        token: token,
        userId: userId,
        authUser: user,
      });
    } catch (err: any) {
      throw new Error(err.response.data.error);
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

export const authenticate = (
  token: string,
  userId: string,
  expiryTime: number,
  resData: user
) => {
  return (dispatch: Dispatch<any>) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: ActionTypes.AUTHENTICATE, token, userId });
    dispatch({ type: ActionTypes.SET_AUTH_USER, authUser: resData });
  };
};

const saveDataToStorage = (
  token: string,
  userId: string,
  expirationDate: string,
  resData: user
) => {
  localStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate,
      authUser: resData,
    })
  );
};

export const logout = () => {
  clearLogoutTimer();
  localStorage.removeItem('userData');
  return { type: ActionTypes.LOGOUT };
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

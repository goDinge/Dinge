import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTHENTICATE,
  SET_AUTH_USER,
  GET_AUTH_USER,
  SET_DID_TRY_AL,
  PROFILE_UPDATE_REDUX,
  GET_VERIFICATION_CODE,
  CODE_VERIFIED,
  SET_NEW_PASSWORD,
  LOGOUT,
} from '../types';
import { CURRENT_IP } from '../../serverConfigs.js';

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

export const setLastLogin = () => {
  return async () => {
    try {
      await axios.put(`${CURRENT_IP}/api/auth/lastlogin`);
    } catch (err) {
      return;
    }
  };
};

export const getAuthUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/auth/me`);
      if (!response) {
        throw new Error('You are not logged in.');
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

export const updateProfile = (profile) => {
  return async (dispatch) => {
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
      const profile = response.data.data.user;

      dispatch({
        type: PROFILE_UPDATE_REDUX,
        authUser: profile,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const changePassword = (password) => {
  return async () => {
    const { oldPassword, newPassword, confirmNewPassword } = password;

    if (newPassword != confirmNewPassword) {
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
      // const profile = response.data.data;
      // console.log('authActions changePassword: ', profile);

      // dispatch({
      //   type: PASSWORD_UPDATE_REDUX
      //   authUser: profile,
      // });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const forgotPassword = (email) => {
  return async (dispatch) => {
    const body = JSON.stringify({ email });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/forgotpassword`,
        body,
        config
      );

      const veriCode = response.data.data;

      dispatch({
        type: GET_VERIFICATION_CODE,
        veriCode: veriCode,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const verifyCode = (code) => {
  return async (dispatch) => {
    const body = JSON.stringify({ code });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/forgotpassword/${code}`,
        body,
        config
      );

      const verified = response.data.success;

      dispatch({
        type: CODE_VERIFIED,
        verified: verified,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const setNewPassword = (password, passwordConfirm, veriCode) => {
  return async (dispatch) => {
    if (password != passwordConfirm) {
      return new Error(
        'Please check your new password fields to make sure they are the same.'
      );
    }

    const body = JSON.stringify({ password });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/auth/forgotpassword/${veriCode}`,
        body,
        config
      );

      const success = response.data.success;

      dispatch({
        type: SET_NEW_PASSWORD,
        newPassword: success,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
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

export const deleteAccount = () => {
  return async () => {
    try {
      await axios.delete(`${CURRENT_IP}/api/auth/me`);
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
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/`,
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
        `${CURRENT_IP}/api/auth/login`,
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

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
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

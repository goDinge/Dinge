import axios from 'axios';
import {
  GET_DINGE,
  POST_DING,
  LIKE_DING,
  UNLIKE_DING,
  GET_LOCAL_DINGE,
} from '../types';
import { HOME_IP } from '@env';

export const getDinge = () => {
  return async (dispatch) => {
    try {
      //console.log('getDinge action - IP used:', HOME_IP);

      const response = await axios.get(`${HOME_IP}/api/dinge`);
      const dinge = response.data.data;

      dispatch({
        type: GET_DINGE,
        dinge: dinge,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const getLocalDinge = (location) => {
  return async (dispatch) => {
    try {
      console.log('getLocalDinge action - IP used: ', HOME_IP);
      const distance = 4;

      const response = await axios.get(
        `${HOME_IP}/api/dinge/local/${distance}/location?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
      );
      const dinge = response.data.data;
      console.log(dinge.length);

      dispatch({
        type: GET_LOCAL_DINGE,
        dinge: dinge,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const postDing = (description, lat, long, img, thumb) => {
  return async (dispatch) => {
    try {
      const thumbName = img.uri.split('/').pop();
      const thumbNameFixed = thumbName.split('.')[0].concat('-thumb.jpg');

      let formData = new FormData();
      formData.append('description', JSON.stringify(description));
      formData.append('location[longitude]', JSON.stringify(long));
      formData.append('location[latitude]', JSON.stringify(lat));
      formData.append('img', {
        uri: `file://${img.uri}`,
        type: 'image/jpg',
        name: `${thumbName}`,
      });
      formData.append('img', {
        uri: `file://${thumb.uri}`,
        type: 'image/jpg',
        name: `${thumbNameFixed}`,
      });

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post(
        `${HOME_IP}/api/dinge/`,
        formData,
        config
      );

      const newDing = response.data.data;

      dispatch({
        type: POST_DING,
        newDing: newDing,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const likeDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`${HOME_IP}/api/ding/likes/${dingId}`);
      const likesList = response.data.data.likes;

      dispatch({
        type: LIKE_DING,
        likesList: likesList,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeDing = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${HOME_IP}/api/ding/likes/${dingId}`
      );
      const likesList = response.data.data.likes;

      dispatch({
        type: UNLIKE_DING,
        likesList: likesList,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const deleteDingById = (dingId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`${HOME_IP}/api/ding/${dingId}`);
      const dinge = response.data.data;

      dispatch({
        type: GET_DINGE,
        dinge: dinge,
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

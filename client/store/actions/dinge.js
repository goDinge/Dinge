import axios from 'axios';
import {
  GET_DINGE,
  POST_DING,
  GET_LOCAL_DINGE,
  UPDATE_DING_LOCATION,
  DELETE_DING_BY_ID,
} from '../types';
import { CURRENT_IP } from '../../serverConfigs.js';

const settingConfigs = require('../../settingConfigs.json');

//this should only be used by admin
export const getDinge = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/dinge`);
      const dinge = response.data.data;

      dispatch({
        type: GET_DINGE,
        dinge: dinge,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.  ');
    }
  };
};

//this should be used by users
export const getLocalDinge = (location) => {
  return async (dispatch) => {
    try {
      const distance = settingConfigs[0].radius;
      const response = await axios.get(
        `${CURRENT_IP}/api/dinge/local/${distance}/location?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
      );
      const dinge = response.data.data;

      dispatch({
        type: GET_LOCAL_DINGE,
        dinge: dinge,
      });
    } catch (err) {
      throw new Error('Dinge. Cannot connect with server. Please try again. ');
    }
  };
};

export const postDing = (description, lat, long, img, thumb) => {
  return async (dispatch) => {
    try {
      const thumbName = img.uri.split('/').pop();
      const thumbNameFixed = thumbName.split('.')[0].concat('-thumb.jpg');

      let formData = new FormData();
      formData.append('description', description);
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
        `${CURRENT_IP}/api/dinge/`,
        formData,
        config
      );

      const newDing = response.data.data;

      dispatch({
        type: POST_DING,
        newDing: newDing,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const updateDingLocation = (dingId, location) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/ding/${dingId}/location?longitude=${location.longitude}&latitude=${location.latitude}`
      );

      const updatedDing = response.data.data;
      dispatch({
        type: UPDATE_DING_LOCATION,
        payload: updatedDing,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const deleteDingById = (dingId) => {
  return async (dispatch) => {
    try {
      await axios.delete(`${CURRENT_IP}/api/ding/${dingId}`);

      dispatch({
        type: DELETE_DING_BY_ID,
        ding: {},
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

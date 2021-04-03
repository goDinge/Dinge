import axios from 'axios';
import { GET_DINGE, POST_DING } from '../types';
import { HOME_IP } from '@env';

export const getDinge = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://${HOME_IP}/api/dinge`);
      const dingeAll = response.data.data;

      dispatch({
        type: GET_DINGE,
        dinge: dingeAll,
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
      formData.append('location[latitude]', JSON.stringify(lat));
      formData.append('location[longitude]', JSON.stringify(long));
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
        `http://${HOME_IP}/api/dinge`,
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

import axios from 'axios';
import { GET_DINGE, POST_DING } from '../types';

export const getDinge = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('http://192.168.0.197:5000/api/dinge');
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

export const postDing = (title, lat, long, img, thumb) => {
  return async (dispatch) => {
    try {
      const thumbName = img.uri.split('/').pop();
      const thumbNameFixed = thumbName.split('.')[0].concat('-thumb.jpg');
      console.log(thumbNameFixed);

      let formData = new FormData();
      formData.append('title', JSON.stringify(title));
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
      //console.log('FORMDATA', formData);

      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post(
        'http://192.168.0.197:5000/api/dinge',
        formData,
        config
      );

      const newDing = response.data.data;
      // console.log('newding', newDing);

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

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

export const postDing = (title, location, img, thumb) => {
  return async (dispatch) => {
    try {
      // let body = new FormData();
      // body.append('title', title);
      // body.append('location', location);
      // body.append('img', img);
      // body.append('img', thumb);
      // console.log('body', body);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ title, location });

      const response = await axios.post(
        'http://192.168.0.197:5000/api/dinge',
        body,
        config
      );

      const newDing = response.data.data;
      console.log('newding', newDing);

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

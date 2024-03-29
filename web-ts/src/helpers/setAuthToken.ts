import axios from 'axios';

export const setAuthToken = (token: string) => {
  if (token) {
    //console.log('setAuthToken: ', token);
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

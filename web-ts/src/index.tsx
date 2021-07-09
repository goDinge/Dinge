import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import store from './store/store';
import { setAuthToken } from './helpers/setAuthToken';

// const x = JSON.parse(localStorage.userData);
// console.log('index hit: ', x.token);

// if (localStorage.userData) {
//   const userDataObj = JSON.parse(localStorage.userData);
//   console.log('token being set: ', userDataObj.token);
//   setAuthToken(userDataObj.token);
// }

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

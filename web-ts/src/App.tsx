import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { setAuthToken } from './helpers/setAuthToken';
import { loadUser } from './store/actions/auth';

import * as AuthActions from './store/actions/auth';

import Navbar from './screens/Navbar';
import Landing from './screens/auth/Landing';
import About from './screens/About';
import Investors from './screens/Investors';
import Profile from './screens/user/Profile';

//import store from './store/store';

import './index.css';
import './App.css';

import './fonts/AirbnbCerealBlack.ttf';
import './fonts/AirbnbCerealBold.ttf';
import './fonts/AirbnbCerealBook.ttf';
import './fonts/AirbnbCerealLight.ttf';
import './fonts/AirbnbCerealMedium.ttf';
import store from './store/store';

const App = () => {
  const dispatch = useDispatch<Dispatch<any>>();

  useEffect(() => {
    const callLoadUser = async () => {
      const userData = await localStorage.getItem('userData');
      if (!userData) {
        dispatch(AuthActions.setDidTryAL());
        return;
      }
      const transformedData = JSON.parse(userData);
      //destructuring - names have to be same as keys in set Item in AsyncStorage
      //from saveDataToStorage
      const { token, userId, expiryDate, authUser } = transformedData;
      const expirationDate = new Date(expiryDate);
      if (expirationDate <= new Date() || !token || !userId) {
        dispatch(AuthActions.setDidTryAL());
        return;
      }
      const expirationTime = expirationDate.getTime() - new Date().getTime();
      try {
        AuthActions.authenticate(token, userId, expirationTime, authUser);
      } catch (err) {
        console.log(err.message);
      }
    };
    callLoadUser();

    store.dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <Switch>
          <Route exact path="/about" component={About} />
          <Route exact path="/investors" component={Investors} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
      </Fragment>
    </Router>
  );
};

export default App;

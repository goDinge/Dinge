import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { getAuthUser } from './store/actions/auth';
import { setAuthToken } from './helpers/setAuthToken';

import * as AuthActions from './store/actions/auth';

import Navbar from './screens/Navbar';
import Landing from './screens/auth/Landing';
import About from './screens/About';
import Investors from './screens/Investors';
import Profile from './screens/user/Profile';
import Public from './screens/user/Public';
import Map from './screens/map/Map';
import Events from './screens/events/Events';
import CreateEvent from './screens/events/CreateEvent';
import UpdateProfile from './screens/user/UpdateProfile';
import ForgotPassword from './screens/auth/ForgotPassword';
import VerificationCode from './screens/auth/VerificationCode';
import ResetPassword from './screens/auth/ResetPassword';
import store from './store/store';

import './index.css';
import './App.css';

import './fonts/AirbnbCerealBlack.ttf';
import './fonts/AirbnbCerealBold.ttf';
import './fonts/AirbnbCerealBook.ttf';
import './fonts/AirbnbCerealLight.ttf';
import './fonts/AirbnbCerealMedium.ttf';

if (localStorage.userData) {
  const data = JSON.parse(localStorage.userData);
  setAuthToken(data.token);
}

const App = () => {
  const dispatch = useDispatch<Dispatch<any>>();

  useEffect(() => {
    const tryLogin = async () => {
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
      } catch (err: any) {
        console.log(err.message);
      }
    };
    tryLogin();
    //console.log('app.tsx storage: ', localStorage.userData);

    if (localStorage.userData) {
      store.dispatch(getAuthUser());
    }
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
          <Route exact path="/public" component={Public} />
          <Route exact path="/map" component={Map} />
          <Route exact path="/events" component={Events} />
          <Route exact path="/createEvent" component={CreateEvent} />
          <Route exact path="/updateProfile" component={UpdateProfile} />
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/verificationCode" component={VerificationCode} />
          <Route exact path="/resetPassword" component={ResetPassword} />
        </Switch>
      </Fragment>
    </Router>
  );
};

export default App;

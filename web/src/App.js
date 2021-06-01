import React, { Fragment } from 'react';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import './index.css';
import './App.css';

import './fonts/AirbnbCerealBlack.ttf';
import './fonts/AirbnbCerealBold.ttf';
import './fonts/AirbnbCerealBook.ttf';
import './fonts/AirbnbCerealLight.ttf';
import './fonts/AirbnbCerealMedium.ttf';

const App = () => {
  return (
    <Fragment>
      <Navbar />
      <Landing />
    </Fragment>
  );
};

export default App;

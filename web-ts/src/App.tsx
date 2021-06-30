import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './screens/Navbar';
import Landing from './screens/Landing';
import About from './screens/About';
import Investors from './screens/Investors';

import './index.css';
import './App.css';

import './fonts/AirbnbCerealBlack.ttf';
import './fonts/AirbnbCerealBold.ttf';
import './fonts/AirbnbCerealBook.ttf';
import './fonts/AirbnbCerealLight.ttf';
import './fonts/AirbnbCerealMedium.ttf';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <Switch>
          <Route exact path="/about" component={About} />
          <Route exact path="/investors" component={Investors} />
        </Switch>
      </Fragment>
    </Router>
  );
};

export default App;

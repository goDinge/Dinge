import React, { useState } from 'react';
import { LogBox, StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import dingeReducer from './store/reducers/dinge';
import dingReducer from './store/reducers/ding';
import imageReducer from './store/reducers/image';
import userReducer from './store/reducers/user';
import authReducer from './store/reducers/auth';
import eventsReducer from './store/reducers/events';
import eventReducer from './store/reducers/event';
import locationReducer from './store/reducers/location';
import commentReducer from './store/reducers/comment';

import AppNavigator from './navigation/AppNavigator';

const fetchFonts = () => {
  return Font.loadAsync({
    'cereal-black': require('./assets/fonts/AirbnbCerealBlack.ttf'),
    'cereal-book': require('./assets/fonts/AirbnbCerealBook.ttf'),
    'cereal-bold': require('./assets/fonts/AirbnbCerealBold.ttf'),
    'cereal-medium': require('./assets/fonts/AirbnbCerealMedium.ttf'),
    'cereal-light': require('./assets/fonts/AirbnbCerealLight.ttf'),
  });
};

const rootReducer = combineReducers({
  dinge: dingeReducer,
  ding: dingReducer,
  image: imageReducer,
  user: userReducer,
  auth: authReducer,
  events: eventsReducer,
  event: eventReducer,
  location: locationReducer,
  comment: commentReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = () => {
  LogBox.ignoreLogs(['Setting a timer']);

  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;

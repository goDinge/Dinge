import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './MapNavigator';
import { BottomTabNavigator } from '../navigation/MapNavigator';
import Startup from '../screens/Startup';

import * as authActions from '../store/actions/auth';

const AppNavigator = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);
  const authUser = useSelector((state) => state.auth.authUser);

  const dispatch = useDispatch();

  if (isAuth) dispatch(authActions.setLastLogin());

  return (
    <NavigationContainer>
      {isAuth && <BottomTabNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <Startup />}
    </NavigationContainer>
  );
};

export default AppNavigator;

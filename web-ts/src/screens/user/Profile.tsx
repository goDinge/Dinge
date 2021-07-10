import React from 'react';
import { useSelector } from 'react-redux';
//import { Dispatch } from 'redux';

import { AppState } from '../../store/reducers/rootReducer';
import { AuthState } from '../../store/interfaces';
//import * as AuthActions from '../../store/actions/auth';

const Profile = () => {
  const authUser: AuthState = useSelector((state: AppState) => state.auth);
  console.log('profile: ', authUser);

  return <div>Profile</div>;
};

export default Profile;

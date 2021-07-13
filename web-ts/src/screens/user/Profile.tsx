import React from 'react';
import { useSelector } from 'react-redux';
//import { Dispatch } from 'redux';

import { AppState } from '../../store/reducers/rootReducer';
import { AuthState } from '../../store/interfaces';
//import * as AuthActions from '../../store/actions/auth';

const Profile = () => {
  const authState: AuthState = useSelector((state: AppState) => state.auth);
  //const authUser = useSelector((state: AppState) => state.auth.authUser);
  console.log('profile authState: ', authState);

  return <div>Profile</div>;
};

export default Profile;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import * as AuthActions from '../../store/actions/auth';

import { AppState } from '../../store/reducers/rootReducer';
import { AuthState } from '../../store/interfaces';

const Profile = () => {
  // const authUser: AuthState = useSelector((state: AppState) => state.auth);
  // console.log('profile: ', authUser);

  const dispatch = useDispatch<Dispatch<any>>();

  const otherAuthUser = async () => {
    try {
      await dispatch(AuthActions.getAuthUser());
    } catch (err) {
      console.log(err.message);
    }
  };

  otherAuthUser();

  return <div>Profile</div>;
};

export default Profile;

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { userState, dingState, AuthState } from '../store/interfaces';
import { AppState } from '../store/reducers/rootReducer';
import * as dingActions from '../store/actions/ding';
import * as userActions from '../store/actions/user';

import CustomSocials from './CustomSocials';
import CustomError from './CustomError';
import xMark from '../assets/x-mark.png';

const CustomDing = () => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = auth.authUser;
  const ding: dingState = useSelector((state: AppState) => state.ding);
  const dingObj = ding.ding;
  const user: userState = useSelector((state: AppState) => state.user);
  const userObj = user.user;

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<Dispatch<any>>();

  const loadUser = useCallback(
    async (userId: string) => {
      try {
        await dispatch(userActions.getUser(userId));
      } catch (err) {
        console.log(err.message);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadUser(dingObj.user);
  }, [dingObj.user, loadUser]);

  let initLikeDing = false;
  if (dingObj.likes && authUser !== null) {
    if (dingObj.likes.includes(authUser._id)) {
      initLikeDing = true;
    }
  }

  //Like and Unlike
  const likeDingHandler = async (dingId: string) => {
    setIsLikeLoading(true);
    setError(null);
    try {
      if (initLikeDing) {
        initLikeDing = false;
        await dispatch(dingActions.unlikeDing(dingId));
      } else {
        initLikeDing = true;
        await dispatch(dingActions.likeDing(dingId));
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLikeLoading(false);
    await dispatch(dingActions.getDing(dingId));
  };

  const closeDingHander = () => {
    dispatch(dingActions.removeDing());
  };

  const onClose = () => {
    setError(null);
  };

  return (
    <div className="ding-overlay">
      <div className="close-ding" onClick={() => closeDingHander()}>
        <img alt="close" src={xMark} />
      </div>
      <div className="ding-container">
        <div className="dingImg">
          <img alt="ding" src={dingObj.imgUrl} />
        </div>
        <div className="custom-socials-container">
          <CustomSocials
            isLikeLoading={isLikeLoading}
            initLikeDing={initLikeDing}
            authUser={authUser}
            itemState={dingObj}
            user={userObj}
            onLike={likeDingHandler}
          />
        </div>
        {error ? (
          <CustomError
            message={error}
            onClose={onClose}
            errorType="error-ding"
          />
        ) : null}
      </div>
    </div>
  );
};

export default CustomDing;

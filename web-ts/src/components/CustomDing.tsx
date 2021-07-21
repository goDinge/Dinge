import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { ding, dingState } from '../store/interfaces';
import { AppState } from '../store/reducers/rootReducer';
import * as dingActions from '../store/actions/ding';

import CustomSocials from './CustomSocials';
import xMark from '../assets/x-mark.png';

const CustomDing = () => {
  const dispatch = useDispatch<Dispatch<any>>();

  const ding: dingState = useSelector((state: AppState) => state.ding);
  const dingObj: ding = ding.ding;

  const closeDingHander = () => {
    dispatch(dingActions.removeDing());
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
          <CustomSocials />
        </div>
      </div>
    </div>
  );
};

export default CustomDing;

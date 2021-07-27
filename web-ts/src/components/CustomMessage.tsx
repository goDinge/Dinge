import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../store/reducers/rootReducer';
import { messageState } from '../store/interfaces';
import * as MessageActions from '../store/actions/message';

const CustomMessage = () => {
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;

  const dispatch = useDispatch<Dispatch<any>>();

  const onClose = () => {
    dispatch(MessageActions.resetMessage());
  };

  return (
    <div className="message-overlay">
      <div className="error-ding">
        <p>{messageStr}</p>
        <button onClick={onClose} className="btn btn-primary">
          Okay
        </button>
      </div>
    </div>
  );
};

export default CustomMessage;

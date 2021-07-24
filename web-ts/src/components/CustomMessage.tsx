import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../store/reducers/rootReducer';
import { message } from '../store/interfaces';
import * as MessageActions from '../store/actions/message';

const CustomMessage = () => {
  const message: message = useSelector((state: AppState) => state.message);

  const dispatch = useDispatch<Dispatch<any>>();

  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(MessageActions.resetMessage());
  };

  return (
    <div className="message-overlay">
      <p>{message}</p>
      <button
        onClick={(e) => onClose(e)}
        className="btn btn-primary"
        value={message} //to close the message div
      >
        Okay
      </button>
    </div>
  );
};

export default CustomMessage;

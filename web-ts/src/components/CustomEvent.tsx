import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../store/reducers/rootReducer';
import {
  userState,
  eventState,
  AuthState,
  messageState,
} from '../store/interfaces';

import * as eventActions from '../store/actions/event';
import * as userActions from '../store/actions/user';
import * as messageActions from '../store/actions/message';
import xMark from '../assets/x-mark.png';

const CustomEvent = () => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = auth.authUser;
  const user: userState = useSelector((state: AppState) => state.user);
  const userObj = user.user;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj = event.event;
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;

  const closeEventHandler = () => {
    dispatch(eventActions.removeEvent());
    dispatch(userActions.removeUser());
    dispatch(messageActions.resetMessage());
  };

  const dispatch = useDispatch<Dispatch<any>>();

  return (
    <div className="ding-overlay">
      <div className="close-ding" onClick={() => closeEventHandler()}>
        <img alt="close" src={xMark} />
      </div>
      <div className="event-container">
        <div className="eventImg">
          <img alt="event" src={eventObj.imgUrl} />
        </div>
        <div>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
};

export default CustomEvent;

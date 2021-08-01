import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../store/reducers/rootReducer';
import {
  userState,
  eventState,
  AuthState,
  messageState,
} from '../store/interfaces';
import CustomSocials from './CustomSocials';

import * as eventActions from '../store/actions/event';
import * as userActions from '../store/actions/user';
import * as messageActions from '../store/actions/message';

import { convertAMPM, properDate } from '../helpers/dateConversions';
import xMark from '../assets/x-mark.png';

const mapStyle = require('../helpers/mapStyles.json');

const CustomEvent = () => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = auth.authUser;
  const user: userState = useSelector((state: AppState) => state.user);
  const userObj = user.user;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj = event.event;
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, onChangeText] = useState('');
  const [modalText, onChangeModalText] = useState('');
  const [commentOrDescription, setCommentOrDescription] = useState<
    'comment' | 'description'
  >('comment');
  const [editEventId, setEditEventId] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState('');
  const [editInitialText, setEditInitialText] = useState('');
  const [deleteEventModal, setDeleteEventModal] = useState(false);

  const dispatch = useDispatch<Dispatch<any>>();

  const messageScreenDing = 'ding';
  const messageScreenMap = 'map';

  let initLikeEvent = false;
  if (eventObj.likes && authUser !== null) {
    if (eventObj.likes.includes(authUser._id)) {
      initLikeEvent = true;
    }
  }

  const openUpdateDescriptionHandler = (id: string, text: string) => {
    setCommentOrDescription('description');
    setEditModal(true);
    setEditEventId(id);
    setEditInitialText(text);
  };

  const likeEventHandler = async (eventId: string) => {
    setIsLikeLoading(true);
    try {
      if (initLikeEvent) {
        initLikeEvent = false;
        await dispatch(eventActions.unlikeEvent(eventId));
      } else {
        initLikeEvent = true;
        await dispatch(eventActions.likeEvent(eventId));
      }
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
    setIsLikeLoading(false);
    await dispatch(eventActions.getEventById(eventId));
  };

  const reportEventHandler = async (eventId: string) => {
    try {
      await dispatch(eventActions.reportEventById(eventId));
      dispatch(messageActions.setMessage('Event Reported!', messageScreenDing));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
  };

  const openEventDeleteModalHandler = () => {
    dispatch(
      messageActions.setMessage(
        'Are you sure you want to delete this ding?',
        messageScreenDing
      )
    );
    //setModalMessage('ding');
    setDeleteEventModal(true);
  };

  const closeEventHandler = () => {
    dispatch(eventActions.removeEvent());
    dispatch(userActions.removeUser());
    dispatch(messageActions.resetMessage());
  };

  return (
    <div className="ding-overlay">
      <div className="close-ding" onClick={() => closeEventHandler()}>
        <img alt="close" src={xMark} />
      </div>
      <div className="event-container">
        <div className="eventImg">
          <img alt="event" src={eventObj.eventPic} />
        </div>
        <div className="event-lower-outer-container">
          <div className="event-lower-inner-container">
            <p className="event-title">{eventObj.eventName}</p>
            <p className="event-info">{properDate(eventObj.date)}</p>
            <p className="event-info">
              {' '}
              {convertAMPM(eventObj.date)} - {convertAMPM(eventObj.endDate)}
            </p>
            <CustomSocials
              isLikeLoading={isLikeLoading}
              initLikeItem={initLikeEvent}
              authUser={authUser}
              itemState={eventObj}
              user={userObj}
              onEditor={openUpdateDescriptionHandler}
              onLike={likeEventHandler}
              onFlag={reportEventHandler}
              onDelete={openEventDeleteModalHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomEvent;

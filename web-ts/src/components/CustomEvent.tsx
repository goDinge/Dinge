import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../store/reducers/rootReducer';
import {
  userState,
  eventState,
  AuthState,
  messageState,
  locationState,
} from '../store/interfaces';

import CustomSocials from './CustomSocials';
import CustomMarker from './CustomMarker';
import CustomCommentInput from './CustomCommentInput';
import CustomMessage from './CustomMessage';
import CustomComment from './CustomComment';
import CustomEditModal from './CustomEditModal';

import * as eventActions from '../store/actions/event';
import * as eventsActions from '../store/actions/events';
import * as userActions from '../store/actions/user';
import * as messageActions from '../store/actions/message';
import * as eventCommentActions from '../store/actions/eventComment';

import { convertAMPM, properDate } from '../helpers/dateConversions';
import xMark from '../assets/x-mark.png';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS } from '../serverConfigs';
import { Colors } from '../constants/Colors';

const mapStyle = require('../helpers/mapStyles.json');
const settingConfigs = require('../settingConfigs.json');

const defaultLocation = {
  center: {
    lat: settingConfigs[2].defaultLocation.coords.latitude,
    lng: settingConfigs[2].defaultLocation.coords.longitude,
  },
  zoom: 15,
};

const CustomEvent = () => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = auth.authUser;
  const user: userState = useSelector((state: AppState) => state.user);
  const userObj = user.user;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj = event.event;
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;
  const location: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationObj: GeolocationPosition = location.location;

  const comments = eventObj.comments;

  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, onChangeText] = useState('');
  const [modalText, onChangeModalText] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState('');
  const [editInitialText, setEditInitialText] = useState('');
  const [deleteEventModal, setDeleteEventModal] = useState(false);

  const dispatch = useDispatch<Dispatch<any>>();

  const messageScreenDing = 'ding';
  const messageScreenMap = 'map';

  const loadUser = useCallback(
    async (userId: string) => {
      try {
        await dispatch(userActions.getUser(userId));
      } catch (err) {
        dispatch(
          messageActions.setMessage(
            'Unable to load ding user',
            messageScreenDing
          )
        );
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadUser(eventObj.user);
  }, [eventObj.user, loadUser]);

  let initLikeEvent = false;
  if (eventObj.likes && authUser !== null) {
    if (eventObj.likes.includes(authUser._id)) {
      initLikeEvent = true;
    }
  }

  //Event
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

  const updatingText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText(e.target.value);
  };

  const updatingModalText = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeModalText(e.target.value);
  };

  const deleteEventHandler = async (eventId: string) => {
    setIsDeleting(true);
    try {
      await dispatch(eventsActions.deleteEventById(eventId));
      await dispatch(eventsActions.getLocalEvents(locationObj));
      setIsDeleting(false);
      closeEventHandler();
      await dispatch(
        messageActions.setMessage('Event Deleted', messageScreenMap)
      );
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
  };

  //Comments
  const postCommentHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    text: string,
    eventId: string
  ) => {
    e.preventDefault();
    if (!text) {
      dispatch(
        messageActions.setMessage('Please type something', messageScreenDing)
      );
      return;
    }
    setIsCommentLoading(true);
    try {
      await dispatch(eventCommentActions.postComment(text, eventId));
      await dispatch(eventActions.getEventById(eventId));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
    onChangeText('');
    setIsCommentLoading(false);
  };

  const editCommentHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
    eventId: string
  ) => {
    e.preventDefault();
    setIsEditLoading(true);
    try {
      await dispatch(eventCommentActions.editComment(modalText, id));
      await dispatch(eventActions.getEventById(eventId));
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
    onChangeModalText('');
    setEditInitialText('');
    setIsEditLoading(false);
    setEditModal(false);
    cancelEditHandler();
  };

  const reportCommentHandler = async (id: string) => {
    try {
      await dispatch(eventCommentActions.reportComment(id));
      dispatch(
        messageActions.setMessage('Comment reported!', messageScreenDing)
      );
    } catch (err) {
      dispatch(messageActions.setMessage(err.message, messageScreenDing));
    }
  };

  //Modal handlers
  const openEditorHandler = (id: string, text: string) => {
    setEditModal(true);
    setEditCommentId(id);
    setEditInitialText(text);
  };

  const cancelEditHandler = () => {
    setEditModal(false);
    setEditInitialText('');
  };

  const closeEventHandler = () => {
    dispatch(eventActions.removeEvent());
    dispatch(userActions.removeUser());
    dispatch(messageActions.resetMessage());
  };

  //will change to edit Event handler after create event is built
  const updateEventHandler = (id: string) => {
    dispatch(eventActions.removeEvent());
  };

  const openEventDeleteModalHandler = () => {
    dispatch(
      messageActions.setMessage(
        'Are you sure you want to delete this event?',
        messageScreenDing
      )
    );
    setDeleteEventModal(true);
  };

  //location
  const eventLocation = {
    lat: eventObj.location.latitude,
    lng: eventObj.location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <div className="ding-overlay">
      {messageStr ? (
        <CustomMessage
          overlay="message-map-overlay"
          component="message-event"
          item={eventObj}
          delete={deleteEventModal}
          isDeleting={isDeleting}
          onDelete={deleteEventHandler}
        />
      ) : null}
      {editModal ? (
        <CustomEditModal
          textType="comment"
          modalText={modalText}
          itemState={eventObj}
          isEditLoading={isEditLoading}
          editInitialText={editInitialText}
          editItemId={editCommentId}
          onText={updatingModalText}
          onEdit={editCommentHandler}
          onCancel={cancelEditHandler}
        />
      ) : null}
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
              {convertAMPM(eventObj.date)} - {convertAMPM(eventObj.endDate)}
            </p>
            <p className="event-info" style={{ marginBottom: '20px' }}>
              <Link
                to={{ pathname: '/public', state: userObj }}
                style={{ color: Colors.grey }}
              >
                Organizer: {userObj.name}
              </Link>
            </p>
            <div className="event-map-container">
              <GoogleMapReact
                bootstrapURLKeys={{ key: GOOGLE_MAPS }}
                defaultCenter={defaultLocation.center}
                defaultZoom={defaultLocation.zoom}
                center={eventLocation}
                options={{ styles: mapStyle, scrollwheel: false }}
                yesIWantToUseGoogleMapApiInternals={true}
              >
                <CustomMarker
                  data={eventObj}
                  lat={eventLocation.lat}
                  lng={eventLocation.lng}
                />
              </GoogleMapReact>
            </div>
            <p className="event-title">About this event</p>
            <p className="event-info" style={{ marginBottom: '5px' }}>
              {eventObj.address}
            </p>
            <p className="event-text" style={{ marginBottom: '20px' }}>
              {eventObj.description}
            </p>
            <CustomSocials
              type="event"
              isLikeLoading={isLikeLoading}
              initLikeItem={initLikeEvent}
              authUser={authUser}
              itemState={eventObj}
              user={userObj}
              onEditor={updateEventHandler}
              onLike={likeEventHandler}
              onFlag={reportEventHandler}
              onDelete={openEventDeleteModalHandler}
            />
            <CustomCommentInput
              itemState={eventObj}
              text={text}
              isCommentLoading={isCommentLoading}
              onText={updatingText}
              onComment={postCommentHandler}
            />
            {comments &&
              comments.map((item, index) => {
                return (
                  <CustomComment
                    type="event"
                    key={index}
                    comment={item}
                    authUser={authUser}
                    item={eventObj}
                    onEditor={openEditorHandler}
                    onFlag={reportCommentHandler}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomEvent;

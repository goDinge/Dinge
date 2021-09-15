import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/reducers/rootReducer';
import {
  AuthState,
  eventsState,
  event,
  eventState,
  messageState,
} from '../../store/interfaces';
import { FiSettings } from 'react-icons/fi';
import { sortEvents } from '../../helpers/sortEvents';
import CustomCalendarEventItem from '../../components/CustomCalendarEventItem';
import CustomEvent from '../../components/CustomEvent';
import CustomMessage from '../../components/CustomMessage';
import { Colors } from '../../constants/Colors';

const Profile = () => {
  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = authState.authUser;
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj: event = event.event;
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;

  const currentTime = Date.now();

  const [hrefState, setHrefState] = useState(authUser?.website);

  const activeUserEvents = eventsArr
    .filter((event) => currentTime < Date.parse(event.endDate.toString()))
    .filter((event) => authUser?._id === event.user);

  activeUserEvents.sort(sortEvents);

  const dynamicURL = useCallback(() => {
    if (authUser?.website) {
      if (
        authUser.website.length > 8 &&
        authUser.website.slice(0, 8) === 'https://'
      ) {
        return;
      }
      if (
        authUser.website.length > 7 &&
        authUser.website.slice(0, 7) === 'http://'
      ) {
        return;
      }
      setHrefState('https://' + authUser.website);
    } else {
      return;
    }
  }, [authUser]);

  let facebookUrl = authUser?.facebook;

  useEffect(() => {
    dynamicURL();
  }, [dynamicURL]);

  const deleteDingHandler = () => {}; //empty fn to pass TS

  return (
    <div className="generic-screen">
      <div className="profile-container">
        <div className="profile-inner-container">
          <div className="profile-id-container">
            <div className="profile-name-setting">
              <p className="profile-name">{authUser?.name}</p>
              <Link to="/UpdateProfile">
                <FiSettings
                  size={28}
                  color={Colors.primary}
                  style={{ marginRight: 8, cursor: 'pointer' }}
                />
              </Link>
            </div>
            <p className="profile-text">{authUser?.level}</p>
            <p className="profile-text">Rep: {authUser?.reputation}</p>
          </div>
          <div className="profile-avatar-container">
            <img
              className="profile-avatar"
              alt="profile"
              src={authUser?.avatar}
            />
          </div>
          <div className="profile-stats-container">
            <p className="profile-title">Socials</p>
            <div
              className="profile-socials-container"
              style={{ display: 'block' }}
            >
              <div
                className="profile-social-box"
                style={{ alignItems: 'flex-start' }}
              >
                <p className="profile-social-title">Website</p>
                {authUser?.website ? (
                  <a href={hrefState}>
                    <p
                      className="profile-text"
                      style={{ width: '360px', wordWrap: 'break-word' }}
                    >
                      {authUser?.website}
                    </p>
                  </a>
                ) : (
                  <p className="profile-text">no website</p>
                )}
              </div>
              <div
                className="profile-social-box"
                style={{ alignItems: 'flex-start' }}
              >
                <p className="profile-social-title">facebook</p>
                {authUser?.facebook ? (
                  <a href={facebookUrl}>
                    <p
                      className="profile-text"
                      style={{ width: '360px', wordWrap: 'break-word' }}
                    >
                      {authUser?.facebook}
                    </p>
                  </a>
                ) : (
                  <p className="profile-text">no facebook</p>
                )}
              </div>
            </div>
          </div>
          <div className="profile-stats-container">
            <p className="profile-title">Active Events</p>
            <div className="profile-socials-container">
              <div className="profile-events-list">
                {activeUserEvents.map((item, index) => (
                  <CustomCalendarEventItem
                    item={item}
                    key={index}
                    type="profile"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="profile-stats-container">
            <div className="my-1 center">
              <Link to="/privacy">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '50%' }}
                >
                  Privacy Policy
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {eventObj.user !== '' ? <CustomEvent /> : null}
      {messageStr && message.screen === 'map' ? (
        <CustomMessage
          overlay="message-map-overlay"
          component="message-map"
          item={eventObj}
          onDelete={deleteDingHandler} //does nothing;
        />
      ) : null}
    </div>
  );
};

export default Profile;

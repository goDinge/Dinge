import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
//import { Dispatch } from 'redux';

import { AppState } from '../../store/reducers/rootReducer';
import { AuthState, eventsState, event } from '../../store/interfaces';
import { sortEvents } from '../../helpers/sortEvents';
import CustomCalendarEventItem from '../../components/CustomCalendarEventItem';
//import * as AuthActions from '../../store/actions/auth';

const Profile = () => {
  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = authState.authUser;
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;

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

  return (
    <div className="profile-container">
      <div className="profile-inner-container">
        <div className="profile-id-container">
          <p className="profile-name">{authUser?.name}</p>
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
      </div>
    </div>
  );
};

export default Profile;

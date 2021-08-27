import React, { useState, useEffect, useCallback } from 'react';
import { AppState } from '../../store/reducers/rootReducer';
import { event, eventsState, eventState } from '../../store/interfaces';
import { useSelector } from 'react-redux';
import { user } from '../../store/interfaces';
import websiteImg from '../../assets/website.png';
import facebookImg from '../../assets/facebook.png';
import CustomCalendarEventItem from '../../components/CustomCalendarEventItem';
import CustomEvent from '../../components/CustomEvent';

import { sortEvents } from '../../helpers/sortEvents';

const Public = ({ location }: { location: any }) => {
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj: event = event.event;

  const user: user = location.state;
  const currentTime = Date.now();

  const [hrefState, setHrefState] = useState(user.website);

  const activeUserEvents = eventsArr
    .filter((event) => currentTime < Date.parse(event.endDate.toString()))
    .filter((event) => user._id === event.user);

  activeUserEvents.sort(sortEvents);

  const dynamicURL = useCallback(() => {
    if (user.website) {
      if (user.website.length > 8 && user.website.slice(0, 8) === 'https://') {
        return;
      }
      if (user.website.length > 7 && user.website.slice(0, 7) === 'http://') {
        return;
      }
      setHrefState('https://' + user.website);
    } else {
      return;
    }
  }, [user]);

  let facebookUrl = user.facebook;

  useEffect(() => {
    dynamicURL();
  }, [dynamicURL]);

  return (
    <div className="calender-screen">
      <div className="profile-container">
        <div className="profile-inner-container">
          <div className="profile-id-container">
            <p className="profile-name">{user.name}</p>
            <p className="profile-text">{user.level}</p>
            <p className="profile-text">Rep: {user.reputation}</p>
          </div>
          <div className="profile-avatar-container">
            <img className="profile-avatar" alt="profile" src={user.avatar} />
          </div>
          <div className="profile-stats-container">
            <p className="profile-title">Socials</p>
            <div className="profile-socials-container">
              <div className="profile-social-box">
                <p className="profile-social-title">Website</p>
                {user.website ? (
                  <a href={hrefState}>
                    <img
                      className="profile-social-icon"
                      alt="website"
                      src={websiteImg}
                    />
                  </a>
                ) : (
                  <p className="profile-text">no website</p>
                )}
              </div>
              <div className="profile-social-box">
                <p className="profile-social-title">facebook</p>
                {user.facebook ? (
                  <a href={facebookUrl}>
                    <img
                      className="profile-social-icon"
                      alt="facebook"
                      src={facebookImg}
                    />
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
      {eventObj.user !== '' ? <CustomEvent /> : null}
    </div>
  );
};

export default Public;

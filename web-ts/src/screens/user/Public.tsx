import React from 'react';
import { AppState } from '../../store/reducers/rootReducer';
import { eventState } from '../../store/interfaces';
import { useSelector } from 'react-redux';
import { user } from '../../store/interfaces';

// import CustomCalendarEventItem from '../../components/CustomCalendarEventItem';
// import { Colors } from '../../constants/Colors';
import { sortEvents } from '../../helpers/sortEvents';

const Public = ({ location }: { location: any }) => {
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj = event.event;

  const user: user = location.state;

  return (
    <div className="profile-container">
      <div className="profile-inner-container">
        <div className="profile-id-container"></div>
        <p className="profile-name">{user.name}</p>
        <p className="profile-text">{user.level}</p>
        <p className="profile-text">Rep: {user.reputation}</p>
      </div>
    </div>
  );
};

export default Public;

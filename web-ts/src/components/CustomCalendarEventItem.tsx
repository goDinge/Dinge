import React from 'react';
import { event } from '../store/interfaces';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import * as eventActions from '../store/actions/event';
import * as messageActions from '../store/actions/message';
import { convertAMPM, properDate } from '../helpers/dateConversions';

const CustomCalendarEventItem = ({
  item,
  type,
}: {
  item: event;
  type: string;
}) => {
  const dispatch = useDispatch<Dispatch<any>>();
  const messageScreen = 'map';
  const screenType = type;

  const onDetails = (id: string) => {
    try {
      dispatch(eventActions.getEventById(id));
    } catch (err) {
      dispatch(
        messageActions.setMessage(`Unable to get event info`, messageScreen)
      );
    }
  };

  return (
    <div
      className={
        screenType === 'profile'
          ? 'profile-event-container'
          : 'calendar-event-container'
      }
    >
      <div
        className={
          screenType === 'profile'
            ? 'profile-event-time-container'
            : 'calendar-event-time-container'
        }
      >
        <p className="calendar-event-text" style={{ fontSize: 14 }}>
          {screenType === 'profile' ? properDate(item.date) : null}
        </p>
        <p className="calendar-event-text" style={{ fontSize: 14 }}>
          {convertAMPM(item.date)} - {convertAMPM(item.endDate)}
        </p>
      </div>
      <div
        className="calendar-event-info-container"
        onClick={() => onDetails(item._id)}
      >
        <p className="calendar-event-title">{item.eventName}</p>
        <p className="calendar-event-text">
          {item.description.length > 21
            ? item.description.split(' ').slice(0, 20).join(' ') + '...'
            : item.description}
        </p>
      </div>
    </div>
  );
};

export default CustomCalendarEventItem;

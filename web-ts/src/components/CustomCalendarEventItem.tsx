import React from 'react';
import { event } from '../store/interfaces';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import * as eventActions from '../store/actions/event';
import * as messageActions from '../store/actions/message';
import { convertAMPM } from '../helpers/dateConversions';

const CustomCalendarEventItem = ({ item }: { item: event }) => {
  const dispatch = useDispatch<Dispatch<any>>();
  const messageScreen = 'map';

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
    <div className="calendar-event-container">
      <div className="calendar-event-time-container">
        <p className="calendar-event-text">
          {convertAMPM(item.date)} - {convertAMPM(item.endDate)}
        </p>
      </div>
      <div
        className="calendar-event-info-container"
        onClick={() => onDetails(item._id)}
      >
        <p className="calendar-event-title">{item.eventName}</p>
        <p className="calendar-event-text">
          {item.description.split(' ').slice(0, 10).join(' ') + '...'}
        </p>
      </div>
    </div>
  );
};

export default CustomCalendarEventItem;

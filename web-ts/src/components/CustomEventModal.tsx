import React from 'react';
import { eventTypes } from '../helpers/eventTypes';
import xMark from '../assets/x-mark.png';

const CustomEventModal = (props: {
  component: 'message-ding' | 'message-map' | 'message-event';
  chooseEvent: (event: string) => void;
  onClose: () => void;
}) => {
  const { component, chooseEvent, onClose } = props;

  const chooseEventType = (event: string) => {
    chooseEvent(event);
    onClose();
  };

  return (
    <div className="ding-overlay">
      <div className="close-ding" onClick={onClose}>
        <img alt="close" src={xMark} />
      </div>

      <div className={component}>
        <p>Choose Event Type</p>
        {eventTypes.map((item, index) => (
          <p
            key={index}
            className="create-event-text"
            onClick={() => chooseEventType(item)}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CustomEventModal;

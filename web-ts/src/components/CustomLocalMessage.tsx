import React from 'react';

type overlayType =
  | 'error-map-overlay'
  | 'error-events-calendar-overlay'
  | 'no-overlay';

const CustomLocalMessage = (props: {
  message: string | null;
  onClose: () => void;
  overlayType: overlayType;
}) => {
  const { message, onClose, overlayType } = props;

  return (
    <div className={overlayType} style={{ zIndex: 20000 }}>
      <div key={message} className="error-events">
        <p>{message}</p>
        <button onClick={onClose} className="btn btn-primary">
          Okay
        </button>
      </div>
    </div>
  );
};

export default CustomLocalMessage;

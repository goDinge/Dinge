import React from 'react';

type errorType =
  | 'error'
  | 'error-map'
  | 'error-ding'
  | 'error-socials'
  | 'error-comment'
  | 'error-events';

type overlayType =
  | 'error-map-overlay'
  | 'error-events-calendar-overlay'
  | 'no-overlay';

const CustomError = (props: {
  message: string | null;
  onClose: () => void;
  errorType: errorType;
  overlayType: overlayType;
}) => {
  const { message, onClose, errorType, overlayType } = props;

  return (
    <div className={overlayType} style={{ zIndex: 20000 }}>
      <div key={message} className={errorType}>
        <p className="error-title">An error occurred!</p>
        <p>{message}</p>
        <button onClick={onClose} className="btn btn-primary">
          Okay
        </button>
      </div>
    </div>
  );
};

export default CustomError;

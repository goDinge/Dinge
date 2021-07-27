import React from 'react';

type errorType =
  | 'error'
  | 'error-map'
  | 'error-ding'
  | 'error-socials'
  | 'error-comment';

type overlayType = 'map-overlay' | 'no-overlay';

const CustomError = (props: {
  message: string | null;
  onClose: () => void;
  errorType: errorType;
  overlayType: overlayType;
}) => {
  const { message, onClose, errorType, overlayType } = props;

  return (
    <div className={overlayType}>
      <div key={message} className={errorType}>
        <p>{message}</p>
        <button onClick={onClose} className="btn btn-primary">
          Okay
        </button>
      </div>
    </div>
  );
};

export default CustomError;

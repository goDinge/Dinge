import React from 'react';
import { errorType, overlayType } from '../store/interfaces';

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
        <p className="message-title">An error occurred!</p>
        <p>{message}</p>
        <button onClick={onClose} className="btn btn-primary">
          Okay
        </button>
      </div>
    </div>
  );
};

export default CustomError;

import React from 'react';

type errorType = 'error' | 'error-map' | 'error-socials' | 'error-ding';

const CustomError = (props: {
  message: string | null;
  onClose: () => void;
  errorType: errorType;
}) => {
  const { message, onClose, errorType } = props;

  return (
    <div key={message} className={errorType}>
      <p>{message}</p>
      <button onClick={onClose} className="btn btn-primary">
        Okay
      </button>
    </div>
  );
};

export default CustomError;

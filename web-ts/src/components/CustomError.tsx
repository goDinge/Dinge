import React from 'react';

const CustomError = (props: {
  message: string | null;
  onClose: any;
  map: boolean;
}) => {
  const { message, onClose, map } = props;

  return (
    <div key={message} className={map ? 'message-map' : 'message'}>
      <p className="">{message}</p>
      <button onClick={onClose} className="btn btn-primary">
        Okay
      </button>
    </div>
  );
};

export default CustomError;

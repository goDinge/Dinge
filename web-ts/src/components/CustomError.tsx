import React from 'react';

const CustomError = (props: { message: string; onClose: any }) => {
  const message = props.message;
  const onClose = props.onClose;

  return (
    <div key={message} className="message">
      <p>{message}</p>
      <button onClick={onClose} className="btn btn-primary">
        Okay
      </button>
    </div>
  );
};

export default CustomError;

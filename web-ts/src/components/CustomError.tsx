import React from 'react';

const CustomError = (props: { message: string; onClose: any }) => {
  const message = props.message;
  const onClose = props.onClose;

  // const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   const element = e.target as HTMLButtonElement;
  //   console.log(element);
  // };

  return (
    <div key={message} className="alert">
      <p>{message}</p>
      <button onClick={onClose} className="btn btn-primary">
        Okay
      </button>
    </div>
  );
};

export default CustomError;

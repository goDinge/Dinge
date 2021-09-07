import React from 'react';
import { useHistory } from 'react-router-dom';

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

const CustomRedirectMessage = (props: {
  redirect: string;
  title: string;
  message: string;
  overlayType: overlayType;
  errorType: errorType;
}) => {
  const { redirect, title, message, overlayType, errorType } = props;

  const history = useHistory<History>();

  const redirectLanding = () => {
    history.push(redirect);
  };

  return (
    <div className={overlayType} style={{ zIndex: 20000 }}>
      <div key={message} className={errorType}>
        <p className="error-title">{title}</p>
        <p>{message}</p>
        <button onClick={redirectLanding} className="btn btn-primary">
          Okay
        </button>
      </div>
    </div>
  );
};

export default CustomRedirectMessage;

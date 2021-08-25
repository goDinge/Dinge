import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../store/reducers/rootReducer';
import { AuthState } from '../store/interfaces';

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

const CustomConfirmMessage = (props: {
  message: string | null;
  onClose: () => void;
  errorType: errorType;
  overlayType: overlayType;
}) => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = auth.authUser;

  const { message, onClose, errorType, overlayType } = props;

  return (
    <div className={overlayType} style={{ zIndex: 20000 }}>
      <div key={message} className={errorType}>
        <p>{message}</p>
        <Link to={{ pathname: '/profile', state: authUser }}>
          <button onClick={onClose} className="btn btn-primary">
            Okay
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CustomConfirmMessage;

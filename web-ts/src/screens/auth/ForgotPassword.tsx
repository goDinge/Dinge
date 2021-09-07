import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { useHistory } from 'react-router-dom';
import { AppState } from '../../store/reducers/rootReducer';
import { AuthState } from '../../store/interfaces';

import * as authActions from '../../store/actions/auth';
import CustomError from '../../components/CustomError';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<Dispatch<any>>();
  const history = useHistory<History>();

  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const veriCode: string = authState.veriCode;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onClose = () => {
    setError(null);
  };

  console.log('veriCode: ', veriCode);

  const emailHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter email.');
      return;
    }

    // eslint-disable-next-line no-use-before-define
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line

    if (email && !emailRegex.test(email.toLowerCase())) {
      setError('Email is not correct.');
      return;
    }

    try {
      await dispatch(authActions.forgotPassword(email));
      history.push('/verificationCode');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="calender-screen">
      <div className="profile-container">
        <div className="profile-inner-container">
          <p className="profile-title">Reset Your Password</p>
          <p>
            To reset your password, please enter the email address associated
            with your profile. An email will be sent to your email address with
            a 4-digit verification code.
          </p>
          <form className="form" onSubmit={(e) => emailHandler(e)}>
            <div className="form-group">
              <input
                id="email"
                type="text"
                placeholder="your email"
                value={email}
                onChange={(e) => onChange(e)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Get Verification Code
            </button>
          </form>
        </div>
      </div>
      {error ? (
        <CustomError
          message={error}
          onClose={onClose}
          errorType="error-events"
          overlayType="error-events-calendar-overlay"
        />
      ) : null}
    </div>
  );
};

export default ForgotPassword;

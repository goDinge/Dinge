import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { useHistory } from 'react-router-dom';
import { AppState } from '../../store/reducers/rootReducer';
import { AuthState } from '../../store/interfaces';
import { ActionTypes } from '../../store/types';

import * as authActions from '../../store/actions/auth';
import CustomError from '../../components/CustomError';

const VerificationCode = () => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<Dispatch<any>>();
  const history = useHistory<History>();

  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const veriCode: string = authState.veriCode;
  const verified: boolean = authState.verified;

  useEffect(() => {
    if (verified) {
      history.push('/resetPassword');
    }
  }, [verified, history]);

  const verificationCodeHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.verifyCode(code));
    } catch (err: any) {
      setError(err.messsage);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (veriCode) {
      console.log('we have a veriCode');
      setTimeout(() => {
        dispatch({
          type: ActionTypes.GET_VERIFICATION_CODE,
          veriCode: '',
        });
      }, 1000 * 60 * 10); // veriCode state will last 10 minutes
    }
  }, [veriCode, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const onClose = () => {
    setError(null);
  };

  console.log('veriCode: ', veriCode);

  if (!veriCode) {
    return (
      <div className="calender-screen">
        <div className="profile-container">
          <div className="profile-inner-container">
            <p className="profile-title">
              You do not have the pre-requisite to visit this webpage.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calender-screen">
      <div className="profile-container">
        <div className="profile-inner-container">
          <p className="profile-title">Enter your Verification Code</p>
          <p>
            Enter your 4-digit verification code here. If you did not receive an
            email from Dinge. Please go back to the previous page and request
            another verification code. The verification code will expire after
            10 minutes.
          </p>
          <form className="form" onSubmit={(e) => verificationCodeHandler(e)}>
            <div className="form-group">
              <input
                id="code"
                type="text"
                placeholder="Your 4 digit code"
                value={code}
                onChange={(e) => onChange(e)}
              />
            </div>
            {isLoading ? (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Verifying Code...
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Verify Code
              </button>
            )}
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

export default VerificationCode;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../../store/reducers/rootReducer';
import { AuthState, PasswordForm } from '../../store/interfaces';

import * as authActions from '../../store/actions/auth';
import CustomError from '../../components/CustomError';
import CustomRedirectMessage from '../../components/CustomRedirectMessage';

const ResetPassword = () => {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<Dispatch<any>>();

  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const veriCode: string | null = authState.veriCode;
  const verified: boolean = authState.verified;
  const newPasswordState = authState.newPassword;

  const setNewPasswordHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    password: string,
    confirmPassword: string,
    veriCode: string | null
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(
        authActions.setNewPassword(password, confirmPassword, veriCode)
      );
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.id]: e.target.value });
  };

  const onClose = () => {
    setError(null);
  };

  if (!veriCode && !verified) {
    return (
      <div className="generic-screen">
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
    <div className="generic-screen">
      <div className="profile-container">
        <div className="profile-inner-container">
          <p className="profile-title">Enter your new password</p>
          <p>
            Enter your new password. Please confirm your new password by
            entering it twice.
          </p>
          <form
            className="form"
            onSubmit={(e) =>
              setNewPasswordHandler(
                e,
                passwordForm.password,
                passwordForm.confirmPassword,
                veriCode
              )
            }
          >
            <div className="form-group">
              <input
                id="password"
                type="password"
                placeholder="your new password"
                value={passwordForm.password}
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className="form-group">
              <input
                id="confirmPassword"
                type="password"
                placeholder="confirm your new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => onChange(e)}
              />
            </div>
            {isLoading ? (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Setting New Password...
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Set New Password
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
      {newPasswordState ? (
        <CustomRedirectMessage
          redirect="/"
          overlayType="error-events-calendar-overlay"
          title="New Password Setup."
          message="You now have a new password. Please try logging in again."
          errorType="error-events"
        />
      ) : null}
    </div>
  );
};

export default ResetPassword;

import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import * as authActions from '../../store/actions/auth';
import CustomMessage from '../../components/CustomMessage';
import CustomError from '../../components/CustomError';
import { emailRegex } from '../../helpers/emailRegex';

import { formData } from '../../store/interfaces';
import { AppState } from '../../store/reducers/rootReducer';
import { AuthState } from '../../store/interfaces';

export const Landing = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<formData>({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const authState: AuthState = useSelector((state: AppState) => state.auth);

  const dispatch = useDispatch<Dispatch<any>>();

  if (authState.authUser) {
    return <Redirect to="map" />;
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onClose = () => {
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const emailRegexLocal: RegExp = emailRegex;
    let isValid = true;
    let action: (dispatch: Dispatch<any>) => Promise<void>;

    if (isSignUp) {
      if (password !== password2) {
        isValid = false;
      }
      if (!emailRegexLocal.test(email.toLowerCase())) {
        isValid = false;
      }
      if (!isValid) {
        setError('Please check your inputs.');
        setIsLoading(false);
        return;
      }
      action = authActions.register(name, email, password);
    } else {
      action = authActions.login(email, password);
    }
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const loginOrRegister = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <div className="landing-inner-left">
            <h1 className="large cerealBold">Dinge</h1>
            <p className="lead cerealBook">
              A grassroot, GPS/Map-based arts and entertainment social platform,
              where we rebuild our local community and real human connections,
              one event at a time.
            </p>
          </div>
          <div className="landing-inner-right">
            <Fragment>
              <h1 className="lead text-primary">
                {isSignUp ? 'Register' : 'Login'}
              </h1>
              <form className="form" onSubmit={(e) => onSubmit(e)}>
                {isSignUp ? (
                  <div className="form-group">
                    <input
                      id="name"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => onChange(e)}
                      onFocus={() => onClose()}
                      required
                    />
                  </div>
                ) : null}
                <div className="form-group">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => onChange(e)}
                    onFocus={() => onClose()}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    minLength={6}
                    value={password}
                    onChange={(e) => onChange(e)}
                    onFocus={() => onClose()}
                    required
                  />
                </div>
                {isSignUp ? (
                  <div className="form-group">
                    <input
                      id="password2"
                      type="password"
                      placeholder="Retype Password"
                      minLength={6}
                      value={password2}
                      onChange={(e) => onChange(e)}
                      onFocus={() => onClose()}
                      required
                    />
                  </div>
                ) : null}
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={
                    isSignUp
                      ? isLoading
                        ? 'Registering...'
                        : 'Register'
                      : isLoading
                      ? 'Logging in...'
                      : 'Login'
                  }
                />
              </form>
              <div className="center">
                <p className="my-1">
                  {isSignUp
                    ? `Have an account already?`
                    : `Don't have an account?`}
                </p>
                <p className="text-btn text-primary" onClick={loginOrRegister}>
                  {isSignUp ? 'Login' : 'Register'}
                </p>
              </div>
              <CustomMessage />
              {error ? (
                <CustomError
                  message={error}
                  onClose={onClose}
                  errorType="error"
                />
              ) : null}
            </Fragment>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;

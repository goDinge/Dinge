import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../store/reducers/rootReducer';
import { formData } from '../store/interfaces';
import * as MessageActions from '../store/actions/message';
import CustomMessage from '../components/CustomMessage';

export const Landing = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<formData>({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  // const message = useSelector((state: AppState) => state.message);
  // console.log('landing: ', message);

  const dispatch = useDispatch<Dispatch<any>>();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex =
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (isSignUp) {
      if (password !== password2) {
        isValid = false;
        dispatch(
          MessageActions.addMessage('Please check your passwords.', 'danger')
        );
      }
      if (!emailRegex.test(email.toLowerCase())) {
        isValid = false;
      }
      if (!isValid) {
        dispatch(
          MessageActions.addMessage('Please check your inputs.', 'danger')
        );
      }
      //dispatch register user action
    } else {
      //dispatch login action
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
                    required
                  />
                </div>
                {isSignUp ? (
                  <div className="form-group">
                    <input
                      id="password2"
                      type="password"
                      placeholder="Confirm Password"
                      minLength={6}
                      value={password2}
                      onChange={(e) => onChange(e)}
                      required
                    />
                  </div>
                ) : null}
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={isSignUp ? 'Register' : 'Login'}
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
            </Fragment>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;

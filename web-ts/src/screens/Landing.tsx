import React, { Fragment, useState } from 'react';
import { formData } from '../store/interfaces';

export const Landing = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<formData>({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    //console.log('landing: ', formData);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('landing submit: ', formData);
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
                      type="text"
                      placeholder="Name"
                      name="name"
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
                  />
                </div>
                {isSignUp ? (
                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      name="password2"
                      minLength={6}
                      value={password2}
                      onChange={(e) => onChange(e)}
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
            </Fragment>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;

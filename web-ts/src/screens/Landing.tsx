import React from 'react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="large cerealBold">Welcome to Dinge</h1>
          <p className="lead">
            A grassroot, GPS/Map-based arts and entertainment social platform,
            where we rebuild our local community and real human connections, one
            event at a time.
          </p>
          <p className="lead">App is in development. Stay tuned for updates.</p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;

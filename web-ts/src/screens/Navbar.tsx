import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../store/reducers/rootReducer';
import { AuthState } from '../store/interfaces';
import * as authActions from '../store/actions/auth';

export const Navbar = () => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = auth.authUser;

  const dispatch = useDispatch<Dispatch<any>>();

  const logout = async () => {
    await dispatch(authActions.logout());
  };

  return (
    <nav className="navbar bg-primary">
      <h1 className="cerealBold">
        <Link to="/">Dinge</Link>
        <span style={{ fontSize: 14 }}>beta</span>
      </h1>
      <ul>
        {auth.authUser !== null ? (
          <ul>
            <li>
              <Link to="/map">Map</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/investors">Investors</Link>
            </li>
            <li>
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            </li>
            <li>
              <Link to={{ pathname: '/profile', state: auth.authUser }}>
                <img
                  alt="user"
                  className="nav-bar-avatar"
                  src={authUser?.avatar}
                />
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/investors">Investors</Link>
            </li>
          </ul>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

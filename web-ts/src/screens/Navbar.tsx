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

  const dispatch = useDispatch<Dispatch<any>>();

  const logout = async () => {
    await dispatch(authActions.logout());
  };

  return (
    <nav className="navbar bg-primary">
      <h1 className="cerealBold">
        <Link to="/">Dinge</Link>
      </h1>
      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/investors">Investors</Link>
        </li>
        {auth.authUser !== null ? (
          <ul>
            <li>
              <Link to="/map">Map</Link>
            </li>
            <li>
              <a href="#!" onClick={() => console.log(auth.authUser)}>
                Profile
              </a>
            </li>
            <li>
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            </li>
          </ul>
        ) : null}
      </ul>
    </nav>
  );
};

export default Navbar;

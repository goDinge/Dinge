import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../store/reducers/rootReducer';
import { AuthState } from '../store/interfaces';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import * as authActions from '../store/actions/auth';
//import { logout } from '../store/actions/auth';

export const Navbar = () => {
  const auth: AuthState = useSelector((state: AppState) => state.auth);
  console.log(auth.authUser);

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
              <a href="#!" onClick={() => console.log(auth.authUser)}>
                Profile
              </a>
            </li>
            <li>
              <a href="#!" onClick={logout}>
                Logout
              </a>
            </li>
          </ul>
        ) : null}
      </ul>
    </nav>
  );
};

export default Navbar;

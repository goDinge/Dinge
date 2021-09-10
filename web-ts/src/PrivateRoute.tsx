import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthState } from './store/interfaces';
import { AppState } from './store/reducers/rootReducer';

const PrivateRoute: React.FC<{
  component: any;
  exact: boolean | undefined;
  path: string;
}> = ({ component: Component, ...rest }) => {
  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = authState.authUser;

  return (
    <Route
      {...rest}
      render={(props) =>
        !authUser ? <Redirect to="/" /> : <Component {...props} />
      }
    ></Route>
  );
};

export default PrivateRoute;

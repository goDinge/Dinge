import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { dingeReducer } from './dinge';
import { messageReducer } from './message';

const rootReducer = combineReducers({
  dinge: dingeReducer,
  message: messageReducer,
  auth: authReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

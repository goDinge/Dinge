import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { dingeReducer } from './dinge';
import { dingReducer } from './ding';
import { messageReducer } from './message';
import { eventsReducer } from './events';

const rootReducer = combineReducers({
  dinge: dingeReducer,
  ding: dingReducer,
  message: messageReducer,
  auth: authReducer,
  events: eventsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

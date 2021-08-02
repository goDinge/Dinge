import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { userReducer } from './user';
import { dingeReducer } from './dinge';
import { dingReducer } from './ding';
import { messageReducer } from './message';
import { locationReducer } from './location';
import { eventsReducer } from './events';
import { eventReducer } from './event';
import { eventCommentReducer } from './eventComment';

const rootReducer = combineReducers({
  dinge: dingeReducer,
  ding: dingReducer,
  message: messageReducer,
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  events: eventsReducer,
  event: eventReducer,
  eventComment: eventCommentReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

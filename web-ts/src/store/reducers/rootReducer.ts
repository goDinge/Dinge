import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './auth';
import { userReducer } from './user';
import { dingeReducer } from './dinge';
import { dingReducer } from './ding';
import { messageReducer } from './message';
import { locationReducer } from './location';
import { eventsReducer } from './events';
import { eventReducer } from './event';
import { eventCommentReducer } from './eventComment';

// const authPersistConfig = {
//   key: 'auth',
//   storage: storage,
//   blacklist: ['token'],
// };

const rootReducer = combineReducers({
  dinge: dingeReducer,
  ding: dingReducer,
  message: messageReducer,
  //auth: persistReducer(authPersistConfig, authReducer),
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  events: eventsReducer,
  event: eventReducer,
  eventComment: eventCommentReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

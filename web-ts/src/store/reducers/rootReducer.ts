import { combineReducers } from 'redux';
import { dingeReducer } from './dinge';
import { messageReducer } from './message';

const rootReducer = combineReducers({
  dinge: dingeReducer,
  message: messageReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

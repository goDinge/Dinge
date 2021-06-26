import { combineReducers } from 'redux';
import { dingeReducer } from './dinge';

const rootReducer = combineReducers({
  dinge: dingeReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

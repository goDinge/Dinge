import { createStore, applyMiddleware, AnyAction, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// const persistConfig = {
//   key: 'root',
//   storage,
//   blackList: ['auth'],
// };

//const persistedReducer = persistReducer(persistConfig, rootReducer);

const store: Store<any, AnyAction> = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

//export const persistor = persistStore(store);

export default store;

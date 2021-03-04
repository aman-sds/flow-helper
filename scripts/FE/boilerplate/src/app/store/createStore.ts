import { History } from 'history';
import { connectRouter } from 'connected-react-router';
import { routerMiddleware } from 'react-router-redux';
import {
  AnyAction,
  applyMiddleware,
  CombinedState,
  combineReducers,
  compose,
  createStore as createReduxStore,
  Reducer
} from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import window from 'global/window';
import reducers, { IApplicationState } from 'app/store/reducers';
import rootSaga from 'app/store/sagas';

const sagaMiddleware = createSagaMiddleware();

const createStore = (initialState: IApplicationState, history: History) => {
  // Middleware Configuration
  const middleware = [sagaMiddleware, routerMiddleware(history)];

  // Store Enhancers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const windowObject = window as any;
  let composeEnhancers = compose;

  if (process.env.NODE_ENV === 'development' && typeof windowObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function') {
    composeEnhancers = windowObject.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  try {
    // it's safe to use window now
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reducers as any).router = connectRouter(history);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  // Store Instantiation
  const storeReducers: Reducer<CombinedState<IApplicationState>, AnyAction> = combineReducers<IApplicationState>({
    ...reducers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const rootReducer: Reducer<IApplicationState> = (state, action) => {
    return storeReducers(state, action);
  };
  const store = createReduxStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middleware)));

  sagaMiddleware.run(rootSaga);

  // @ts-ignore
  store.runSaga = sagaMiddleware.run;
  // @ts-ignore
  store.closeSagas = () => store.dispatch(END);

  return store;
};

export default createStore;

import React from 'react';
import { configureAxiosJWTInterseptors } from '@axmit/axios-patch-jwt';
import axios from 'axios';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router';
import { IAsyncStorage, WebStorageDecorator } from 'universal-storage';
import ReactDOM from 'react-dom';
import createStore from 'app/store/createStore';
import App from 'app/App';

import 'app/assets/sass/index.scss';

// Axios initialization

const storage: IAsyncStorage = new WebStorageDecorator(localStorage);
configureAxiosJWTInterseptors({
  storage,
  axios,
  refreshTokenEndpoint: '/auth'
});

axios.defaults.baseURL = `/api`;

// Render Setup

const MOUNT_NODE = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState = (window as any).___INITIAL_STATE__;
const history = createBrowserHistory();
const store = createStore(initialState, history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  MOUNT_NODE
);

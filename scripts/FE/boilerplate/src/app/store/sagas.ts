import { all, takeEvery } from 'redux-saga/effects';
import { clearAuth, communicationAuth } from 'entities/Auth/Auth.communication';

function* errorWatcher() {
  yield takeEvery('*', function* logger(action: any) {
    if (action.type.match('FAIL')) {
      const status = action.payload && action.payload.status;

      if (status === 401) {
        yield clearAuth();
      }

      console.log('ERROR', action.payload);
    }
  });
}

export default function* rootSaga(): any {
  yield all([errorWatcher(), ...communicationAuth.sagas]);
}

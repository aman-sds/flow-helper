import axios from 'axios';
import window from 'global/window';
import {
  EActionsTypes,
  APIProvider,
  BaseStrategy,
  Branch,
  buildCommunication,
  getFailType,
  getStartType,
  getSuccessType,
  StoreBranch
} from '@axmit/redux-communications';
import { push } from 'connected-react-router';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { clearCreds, getCreds, saveCreds } from '@axmit/axios-patch-jwt';
import { message } from 'antd';
import { MessageType } from 'antd/lib/message';
import { IApplicationState } from 'app/store/reducers';
import {
  EAuthSuccessMessage,
  IAuthModel,
  IAuthRegistrationModel,
  IConfirmCodeModel,
  IRestorePasswordModel,
  ISignUpModel,
  ISocialRegistrationModel,
  ITokenModel
} from 'entities/Auth/Auth.models';
import { IAuthUser, IUserModel, IUserUpdateModel } from 'entities/User/User.models';
import { userTransport } from 'entities/User/User.transport';

const namespace = 'auth';

export interface IAuthStoreProps {
  model: StoreBranch<ITokenModel>;
  location: StoreBranch<any>;
  user: StoreBranch<IAuthUser>;
}

export interface IAuthConnectedProps {
  authLocation: StoreBranch<any>;
  authModel: StoreBranch<ITokenModel>;
  authUser: StoreBranch<IAuthUser>;
  authRegistration: StoreBranch<IAuthRegistrationModel>;
  getAuthUser(id: string): void;
  updateAuthUser(params: { data: IUserUpdateModel; id: string }): void;
  addAuthModel(params: IAuthModel): void;
  deleteAuthModel(): void;
  addAuthRegistration(params: ISignUpModel): void;
  confirmAuthRegistration(params: IConfirmCodeModel): void;
  addAuthSocialAuth(params: ISocialRegistrationModel): void;
  addAuthPasswordRestore(email: string): void;
  updateAuthPasswordRestore(params: IRestorePasswordModel): void;
  initAuthModel(): void;
  getAuthLocation(): void;
  clearUserModel(): void;
}

const responseFail = (response: string | object): MessageType | null => {
  return typeof response === 'string' ? message.error(response) : null;
};

const successAuth = function*(response: ITokenModel) {
  const userId = response && response.access && response.access.userId;
  if (userId) {
    yield getAuthUser(userId);
  }
};

const modelApiProvider = [
  new APIProvider(
    EActionsTypes.add,
    (data: IAuthModel): Promise<any> => {
      return axios.post(`/auth`, data).then(response => response.data);
    },
    {
      onSuccess: successAuth,
      onFail: responseFail
    }
  ),
  new APIProvider(EActionsTypes.delete, (): Promise<any> => axios.delete(`/auth`), {
    onSuccess: function*() {
      yield clearAuth();
      yield getUserLocation();
    },
    onFail: responseFail
  }),
  new APIProvider(EActionsTypes.init, (): Promise<ITokenModel> => getCreds(), {
    onSuccess: function*() {
      const AuthModelData = yield select((state: IApplicationState) => state.auth.model.data);
      const userId = AuthModelData && AuthModelData.access && AuthModelData.access.userId;

      yield getUserLocation();

      if (userId) {
        yield getAuthUser(userId);
      } else {
        yield put({ type: getFailType(namespace, 'user', EActionsTypes.get) });
      }
    },
    onFail: responseFail
  })
];

const authUserAPIProvider = [
  new APIProvider(EActionsTypes.get, userTransport.getMe),
  new APIProvider(EActionsTypes.update, userTransport.update, {
    onSuccess: function*(response: IUserModel) {
      const userId = response && response.id;
      if (userId) {
        message.success(EAuthSuccessMessage.ChangeDataSuccess);
        yield getAuthUser(userId);
        yield put(push(`/users/${userId}`));
      }
    },
    onFail: responseFail
  })
];

const registrationApiProvider = [
  new APIProvider(
    EActionsTypes.add,
    (params: ISignUpModel): Promise<any> => {
      return axios.post(`/registration`, params).then(response => response.data);
    },
    {
      // eslint-disable-next-line require-yield
      onSuccess: function*() {
        message.success(EAuthSuccessMessage.CheckEmailForConfirmedLink);
      },
      onFail: responseFail
    }
  ),
  new APIProvider(
    'confirm',
    (params: IConfirmCodeModel): Promise<any> => {
      const { code } = params;
      return axios.put(`/activate`, { code }).then(response => response.data);
    },
    {
      onSuccess: function*(response: ITokenModel) {
        const userId = response && response.access && response.access.userId;
        if (userId) {
          yield getAuthUser(userId);
          message.success(EAuthSuccessMessage.AccountConfirmed);
        }
      },
      onFail: responseFail
    }
  )
];

const passwordRestoreApiProvider = [
  new APIProvider(
    EActionsTypes.add,
    (email: string): Promise<any> => {
      return axios.post(`/restore-password`, email);
    },
    {
      // eslint-disable-next-line require-yield
      onSuccess: function*() {
        message.success(EAuthSuccessMessage.CheckEmailForConfirmedLink);
      },
      onFail: responseFail
    }
  ),
  new APIProvider(
    EActionsTypes.update,
    (params: IRestorePasswordModel): Promise<any> => {
      return axios.put(`/restore-password`, params);
    },
    {
      onSuccess: function*() {
        yield put(push(`/`));
        message.success(EAuthSuccessMessage.ChangePasswordSuccess);
      },
      onFail: responseFail
    }
  )
];

const socialApiProvider = [
  new APIProvider(
    EActionsTypes.add,
    (params: ISocialRegistrationModel): Promise<any> => {
      return axios.post(`/auth/social`, params).then(response => response.data);
    },
    {
      onSuccess: successAuth,
      onFail: responseFail
    }
  )
];

const branches = [
  new Branch('model', modelApiProvider, new StoreBranch<any, any>(null, null, null, true)),
  new Branch('registration', registrationApiProvider),
  new Branch('user', authUserAPIProvider, new StoreBranch<IAuthUser, any>(null, null, null, true)),
  new Branch('socialAuth', socialApiProvider),
  new Branch('passwordRestore', passwordRestoreApiProvider)
];

const strategy = new BaseStrategy({
  namespace,
  branches
});

function* loginSaga() {
  const loginSuccessType = getSuccessType(namespace, 'model', EActionsTypes.add);
  yield takeEvery(loginSuccessType, function*(action: any) {
    yield call(saveCreds, action.payload);
  });
}

function* registrationSaga() {
  const registrationSuccessType = getSuccessType(namespace, 'registration', 'confirm');

  yield takeEvery(registrationSuccessType, function*(action: any) {
    const loginSuccessType = getSuccessType(namespace, 'model', EActionsTypes.add);

    yield put({ type: loginSuccessType, payload: action.payload });
  });
}
function* socialAuthSaga() {
  const socialAuthSuccessType = getSuccessType(namespace, 'socialAuth', EActionsTypes.add);
  yield takeEvery(socialAuthSuccessType, function*(action: any) {
    const socialLoginSuccessType = getSuccessType(namespace, 'model', EActionsTypes.add);
    yield put({ type: socialLoginSuccessType, payload: action.payload });
  });
}

export function* getAuthUser(userId: string) {
  yield put({ type: getStartType('auth', 'user', EActionsTypes.get), payload: userId });
}

export function* getUserLocation() {
  yield put({ type: getStartType('auth', 'location', 'get') });
}

export function* clearAuth() {
  yield clearAuthModel();
  yield clearAuthRegistration();
  yield clearAuthUser();
  yield clearAuthSocialAuth();
  yield clearAuthPasswordRestore();
  yield call(clearCreds);
}

function* clearAuthModel() {
  yield put({ type: getStartType('auth', 'model', 'clear') });
}

function* clearAuthRegistration() {
  yield put({ type: getStartType('auth', 'registration', 'clear') });
}

function* clearAuthUser() {
  yield put({ type: getStartType('auth', 'user', 'clear') });
}

function* clearAuthSocialAuth() {
  yield put({ type: getStartType('auth', 'socialAuth', 'clear') });
}

function* clearAuthPasswordRestore() {
  yield put({ type: getStartType('auth', 'passwordRestore', 'clear') });
}

export const communicationAuth = buildCommunication<IAuthConnectedProps>(strategy);

communicationAuth.sagas.push(loginSaga(), registrationSaga(), socialAuthSaga());

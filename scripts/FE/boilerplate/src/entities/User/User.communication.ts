import {
  EActionsTypes,
  APIProvider,
  BaseStrategy,
  Branch,
  buildCommunication,
  StoreBranch,
  buildCollectionPreRequestDataMapper,
  buildCollectionResponseFormatter
} from '@axmit/redux-communications';
import { message } from 'antd';
import { put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { getAuthUser } from 'entities/Auth/Auth.communication';
import {
  IUserCollection,
  IUserModel,
  IUserCollectionQueryParams,
  IUserUpdateModel,
  ISocialModel
} from 'entities/User/User.models';
import { userTransport } from 'entities/User/User.transport';

const namespace = 'user';

export interface IUserConnectedProps {
  userModel: StoreBranch<IUserModel>;
  userCollection: StoreBranch<IUserCollection>;
  clearUserModel(): void;
  getUserModel(id: string): void;
  getUserCollection(filter?: IUserCollectionQueryParams): void;
  updateUserModel(params: { data: IUserUpdateModel; id: string }): void;
  updateUserSocial(params: { id: string; data: ISocialModel }): void;
}

const UserModelAPIProviders = [
  new APIProvider(EActionsTypes.get, userTransport.get),
  new APIProvider(EActionsTypes.update, userTransport.update, {
    onSuccess: function*(response: IUserModel) {
      const userId = response && response.id;
      if (userId) {
        yield getAuthUser(userId);
        yield put(push(`/users/${userId}`));
      }
    }
  })
];

const UserCollectionAPIProviders = [
  new APIProvider(EActionsTypes.get, userTransport.getCollection, {
    responseFormatter: buildCollectionResponseFormatter<IUserCollection, IUserCollectionQueryParams>(),
    preRequestDataMapper: buildCollectionPreRequestDataMapper<IUserCollectionQueryParams>()
  })
];

const SocialBindApiProvider = [
  new APIProvider(EActionsTypes.update, userTransport.socialBind, {
    onFail: () => message.error('Этот социальный аккаунт уже привязан к пользователю')
  })
];

const branches = [
  new Branch('model', UserModelAPIProviders),
  new Branch('collection', UserCollectionAPIProviders),
  new Branch('social', SocialBindApiProvider)
];

const strategy = new BaseStrategy({
  namespace,
  branches
});

export const communicationUser = buildCommunication<IUserConnectedProps>(strategy);

communicationUser.sagas.push();

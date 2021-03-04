import axios from 'axios';
import { objectToQuery } from 'common/helpers/filters.helper';
import {
  IUserModel,
  IUserUpdateModel,
  IUserCollectionQueryParams,
  IUserCollection,
  ISocialModel,
  IAuthUser,
  IUserQueryParams
} from 'entities/User/User.models';
import { IMapCollectionFilter } from 'entities/Map/Map.models';
import { IGroupCollection } from 'entities/Group/Group.models';

const basePath = '/users';

export const userTransport = {
  get: (id: string): Promise<IUserModel> => axios.get(`${basePath}/${id}`).then(r => r.data),
  getMe: (id: string): Promise<IAuthUser> => axios.get(`${basePath}/${id}/me`).then(r => r.data),
  getCollection: (filter?: IUserCollectionQueryParams): Promise<IUserCollection> =>
    axios.get(`${basePath}${objectToQuery(filter)}`).then(r => r.data),
  getUserMapCollection: (filter: IMapCollectionFilter): Promise<IUserCollection> =>
    axios.get(`${basePath}/map${objectToQuery(filter)}`).then(r => r.data),
  update: (params: { id: string; data: IUserUpdateModel }): Promise<IUserModel> =>
    axios.put(`${basePath}/${params.id}`, params.data).then(r => r.data),
  socialBind: (params: { id: string; data: ISocialModel }): Promise<IUserModel> =>
    axios.put(`${basePath}/${params.id}/social`, params.data).then(r => r.data),

  followToUser: (id: string): Promise<IUserModel> => axios.put(`${basePath}/${id}/follow`).then(r => r.data),

  getFollowUserCollection: (filter: IUserQueryParams): Promise<IUserCollection> => {
    const { userId, ...queryParams } = filter;
    return axios.get(`${basePath}/${userId}/follow${objectToQuery(queryParams)}`).then(r => r.data);
  },
  getFollowersUserCollection: (filter: IUserQueryParams): Promise<IUserCollection> => {
    const { userId, ...queryParams } = filter;
    return axios.get(`${basePath}/${userId}/followers${objectToQuery(queryParams)}`).then(r => r.data);
  },
  getGroupFollowUserCollection: (filter: IUserQueryParams): Promise<IGroupCollection> => {
    const { userId, ...queryParams } = filter;
    return axios.get(`${basePath}/${userId}/group-follow${objectToQuery(queryParams)}`).then(r => r.data);
  }
};

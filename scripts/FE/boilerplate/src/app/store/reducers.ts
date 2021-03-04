import { AnyAction, Reducer } from 'redux';
import { RouterState } from 'react-router-redux';
import { communicationAuth, IAuthStoreProps } from 'entities/Auth/Auth.communication';
import { communicationUser } from 'entities/User/User.communication';

type RoutingReducer = Reducer<RouterState, AnyAction>;

export interface IApplicationState {
  routing?: RoutingReducer | null;
  auth: IAuthStoreProps;
  [key: string]: any;
}

const reducers = {
  ...communicationAuth.reducers,
  ...communicationUser.reducers
};

export default reducers;

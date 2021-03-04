import React from 'react';
import { InfiniteList } from 'common/components/List/InfiniteList';
import { IBaseFilterModel } from 'common/models/requestModels';
import { IMapCollectionFilter } from 'entities/Map/Map.models';
import { communicationUser, IUserConnectedProps } from 'entities/User/User.communication';
import { UserListItem } from 'entities/User/components/UserListItem';
import { IUserCollection, IUserNestedModel } from 'entities/User/User.models';

interface IComponentProps {
  filter?: IMapCollectionFilter;
}

type AllProps = IUserConnectedProps & IComponentProps;

const defaultCoords = {
  northEastLat: 0,
  northEastLon: 0,
  southWestLat: 0,
  southWestLon: 0
};

class UserListComponent extends InfiniteList<IUserCollection, IUserNestedModel, AllProps, IMapCollectionFilter> {
  loadCollection = (params: IBaseFilterModel) => {
    const { getMapUserCollection, filter } = this.props;

    const { northEastLat, northEastLon, southWestLat, southWestLon } = filter || defaultCoords;

    if (northEastLat === 0 && northEastLon === 0 && southWestLat === 0 && southWestLon === 0) {
      return;
    }

    const contentFilter: IMapCollectionFilter = { northEastLat, northEastLon, southWestLat, southWestLon, ...params };

    getMapUserCollection(contentFilter);
  };

  renderListItem = (item: IUserNestedModel) => {
    return <UserListItem item={item} />;
  };

  getCollection = () => {
    return this.props.userCollection;
  };
}

export const UserList = communicationUser.injector(UserListComponent);

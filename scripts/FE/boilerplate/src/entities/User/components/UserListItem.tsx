import React from 'react';
import { List, Row } from 'antd';
import { IUserNestedModel } from 'entities/User/User.models';
import { GroupListItemRequestMenu } from 'entities/Group/components/Menu/GroupListItemRequestMenu';
import { UserListItemCard } from 'entities/User/components/Card/UserListItemCard';
import { GroupListItemModerationMenu } from 'entities/Group/components/Menu/GroupListItemModerationMenu';
import { EGroupUserRoles } from 'entities/Group/Group.models';

interface IComponentProps {
  item: IUserNestedModel;
  requestId?: string;
  type?: EGroupUserRoles;
}

class UserListItemComponent extends React.PureComponent<IComponentProps> {
  render() {
    const { item, requestId, type } = this.props;
    return (
      <List.Item className="pt-0 pb-6 mb-6">
        <Row>
          <UserListItemCard item={item} />
          {requestId && <GroupListItemRequestMenu requestId={requestId} />}
          {type && <GroupListItemModerationMenu type={type} userId={item.id} />}
        </Row>
      </List.Item>
    );
  }
}

export const UserListItem = UserListItemComponent;

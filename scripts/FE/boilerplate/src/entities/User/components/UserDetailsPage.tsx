import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import LayoutBasic from 'common/components/Layouts/LayoutBasic';
import { LoadingSpin } from 'common/components/LoadingSpin';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';
import { communicationUser, IUserConnectedProps } from 'entities/User/User.communication';
import { UserDetails } from 'entities/User/components/UserDetails';

interface IParams {
  id?: string;
}

type AllProps = IUserConnectedProps & IAuthConnectedProps & RouteComponentProps<IParams> & FormComponentProps;

class UserDetailsPageComponent extends React.PureComponent<AllProps> {
  componentDidMount() {
    const { getUserModel, match } = this.props;
    const { params } = match;
    const { id } = params;

    if (id) {
      getUserModel(id);
    }
  }

  componentDidUpdate() {
    const { getUserModel, match, userModel } = this.props;
    const { params } = match;
    const { id } = params;
    const userData = userModel.data || { id: undefined };
    const isUrlChanged = id !== userData.id && !userModel.loading;

    if (id && isUrlChanged) {
      getUserModel(id);
    }
  }

  componentWillUnmount() {
    const { clearUserModel } = this.props;

    clearUserModel();
  }

  render() {
    const { match, userModel, authUser } = this.props;
    const { loading: authLoading } = authUser;
    const { loading: userLoading } = userModel;
    const isLoading = authLoading || userLoading;
    const { params } = match;
    const { id: userId } = params;

    return <LayoutBasic id="userPage">{isLoading ? <LoadingSpin /> : <UserDetails userId={userId} />}</LayoutBasic>;
  }
}

export const UserDetailsPage = communicationUser.injector(
  communicationAuth.injector(Form.create<AllProps>()(UserDetailsPageComponent))
);

import React from 'react';
import { Redirect } from 'react-router';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';

interface IComponentProps {
  redirectUrl?: string;
}
type AllProps = IAuthConnectedProps & IComponentProps;

class PrivateLayoutComponent extends React.Component<AllProps> {
  render() {
    const { authModel, children, redirectUrl = '/' } = this.props;
    const { data, loading } = authModel;
    const authorized = data && Object.keys(data).length !== 0;

    if (!authorized && !loading) {
      return <Redirect to={redirectUrl} />;
    }

    if (authorized && !loading) {
      return children;
    }
    return null;
  }
}

export const PrivateLayout = communicationAuth.injector(PrivateLayoutComponent);

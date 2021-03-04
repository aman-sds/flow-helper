import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';

type AllProps = IAuthConnectedProps & RouteComponentProps;

class SignUpConfirmComponent extends React.PureComponent<AllProps> {
  componentDidMount() {
    const { history, confirmAuthRegistration } = this.props;
    const code = history && history.location && history.location.search.split('code=')[1];
    confirmAuthRegistration({ code });
  }

  render() {
    return null;
  }
}

export const SignUpConfirmPage = communicationAuth.injector(withRouter(SignUpConfirmComponent));

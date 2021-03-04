import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';

type AllProps = IAuthConnectedProps & RouteComponentProps;

class NewPasswordRedirect extends React.PureComponent<AllProps> {
  constructor(props: AllProps) {
    super(props);
    const { history } = this.props;
    const code = history && history.location && history.location.search.split('code=')[1];

    if (code) {
      history({ modalType: EAuthModalType.NewPass, property: code });
    }
  }

  render() {
    return null;
  }
}

export const NewPasswordRedirectPage = communicationUI.injector(communicationAuth.injector(withRouter(NewPasswordRedirect)));

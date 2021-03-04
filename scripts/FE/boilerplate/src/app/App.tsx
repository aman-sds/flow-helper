import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { NotFound } from 'common/components/NotFound';
import { Header } from 'common/components/Header/Header';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';
import { LoginPage } from 'entities/Auth/components/LoginPage';
import { SignUpPage } from 'entities/Auth/components/SignUpPage';
import { NewPasswordPage } from 'entities/Auth/components/NewPasswordPage';
import { NewPasswordRedirectPage } from 'entities/Auth/components/NewPasswordRedirectPage';
import { SignUpConfirmPage } from 'entities/Auth/components/SignUpConfirmPage';

// Put your API models here
// import '@axmit/activatica-api';

type AllProps = IAuthConnectedProps & RouteComponentProps;

class App extends React.Component<AllProps> {
  constructor(props: AllProps) {
    super(props);
    this.props.initAuthModel();
  }

  render() {
    return (
      <>
        <Header />
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/new-password" exact component={NewPasswordPage} />
          <Route path="/new-password/*" component={NewPasswordRedirectPage} />
          <Route path="/confirm/*" component={SignUpConfirmPage} />
          <Route path="/*" component={NotFound} />
        </Switch>
      </>
    );
  }
}

export default communicationAuth.injector(withRouter(App));

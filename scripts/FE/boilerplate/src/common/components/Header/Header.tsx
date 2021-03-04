import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Row, Col, Menu } from 'antd';
import Icon from '@ant-design/icons/es';
import Logo from 'common/components/Header/Logo';
import { communicationUser } from 'entities/User/User.communication';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';

type AllProps = IAuthConnectedProps & RouteComponentProps;

interface IComponentState {
  currentTab: string;
}
class HeaderComponent extends React.Component<AllProps, IComponentState> {
  render() {
    const { authModel } = this.props;
    const { data: authData } = authModel;

    return (
      <header className="basic-block-header">
        <Row className="header flex-noWrap" justify="space-between" align="middle">
          <Col className="header__logo">
            <Logo />
          </Col>

          <Col className="header__burger">
            <Menu mode="vertical-right" overflowedIndicator={<Icon className="m-0" type="menu" />}>
              {!authData && (
                <Menu.Item className="header__text" onClick={this.signin}>
                  SignUp
                </Menu.Item>
              )}

              {!authData && (
                <Menu.Item className="header__text" onClick={this.login}>
                  SignIn
                </Menu.Item>
              )}

              {authData && (
                <Menu.Item className="header__text" onClick={this.redirectToProfile}>
                  Profile
                </Menu.Item>
              )}

              {authData && (
                <Menu.Item className="header__text" onClick={this.logout}>
                  Logout
                </Menu.Item>
              )}
            </Menu>
          </Col>
        </Row>
      </header>
    );
  }

  login = () => {
    const { history } = this.props;
    history.push(`/login`);
  };

  signin = () => {
    const { history } = this.props;
    history.push(`/signin`);
  };

  redirectToProfile = () => {
    const { history, authModel, getAuthUser, clearUserModel } = this.props;
    const { data: authData } = authModel;
    const currentUserId = authData?.access?.userId;

    clearUserModel();

    if (currentUserId) {
      getAuthUser(currentUserId);
    }

    history.push(`/users/${currentUserId}`);
  };

  logout = () => {
    const { deleteAuthModel } = this.props;

    deleteAuthModel();
  };
}

export const Header = communicationUser.injector(communicationAuth.injector(withRouter(HeaderComponent)));

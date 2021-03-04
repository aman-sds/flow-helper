import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Form, Button, Checkbox, Input, Row, Typography } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { AntdFormHelper } from '@axmit/antd-helpers';
import { Link } from 'react-router-dom';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';
import { EAuthFormError, ESocialType } from 'entities/Auth/Auth.models';
import { getSocialAuthData } from 'entities/Auth/helpers/socialAuth.helper';

interface IComponentState {
  isPoliticsAccepted: boolean;
}

type AllProps = IAuthConnectedProps & RouteComponentProps & FormComponentProps;

class SignUpFormComponent extends React.PureComponent<AllProps, IComponentState> {
  state = {
    isPoliticsAccepted: true
  };

  render() {
    const { form } = this.props;
    const { isPoliticsAccepted } = this.state;
    const { getFieldDecorator } = form;

    return (
      <>
        <Form className="mb-5" onSubmit={this.signUp}>
          <Form.Item className="mb-6">
            {getFieldDecorator('fullName', {
              rules: [
                {
                  required: true,
                  message: EAuthFormError.FullName
                }
              ]
            })(<Input type="text" size="large" placeholder="Name" />)}
          </Form.Item>

          <Form.Item className="mb-6">
            {getFieldDecorator('email', {
              rules: [{ required: true, message: EAuthFormError.Email }]
            })(<Input type="email" size="large" placeholder="Email" />)}
          </Form.Item>

          <Form.Item className="mb-6">
            {getFieldDecorator('password', { rules: [{ required: true, message: EAuthFormError.Password }] })(
              <Input type="password" size="large" placeholder="Password" />
            )}
          </Form.Item>

          <Form.Item className="mb-2">
            {getFieldDecorator('politics', {
              valuePropName: 'checked',
              initialValue: false
            })(
              <Checkbox className="fs" style={{ lineHeight: '1.25em', cursor: 'auto' }} onChange={this.politicAcceptToggle}>
                I accept
                <a href="privacyPolicies.pdf" target="_blank" rel="noopener noreferrer">
                  &ensp;privacy policies
                </a>
              </Checkbox>
            )}
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="danger" size="large" htmlType="submit" block={true} disabled={isPoliticsAccepted}>
              SignUp
            </Button>
          </Form.Item>
        </Form>

        <Row type="flex" justify="center" align="middle">
          <Typography.Text className="fs-xxs">Already have an account?</Typography.Text>&nbsp;
          <Link className="cursor-pointer" to="/login">
            <Typography.Text className="fs-xxs color-blue">Login</Typography.Text>
          </Link>
        </Row>
      </>
    );
  }

  politicAcceptToggle = () => {
    this.setState({ isPoliticsAccepted: !this.state.isPoliticsAccepted });
  };

  loginWithVk = () => {
    const { addAuthSocialAuth } = this.props;

    getSocialAuthData(ESocialType.Vk).then(data => {
      addAuthSocialAuth(data);
    });
  };

  loginWithGoogle = () => {
    const { addAuthSocialAuth } = this.props;

    getSocialAuthData(ESocialType.Google).then(data => {
      addAuthSocialAuth(data);
    });
  };

  loginWithFacebook = () => {
    const { addAuthSocialAuth } = this.props;
    getSocialAuthData(ESocialType.Facebook).then(data => {
      addAuthSocialAuth(data);
    });
  };

  signUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { form, addAuthRegistration } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        addAuthRegistration(values);
      }
    });
  };
}

export const SignUpPage = communicationAuth.injector(
  withRouter(
    Form.create({
      mapPropsToFields(props: AllProps) {
        const { authRegistration } = props;

        return AntdFormHelper.mapValidationToFields(authRegistration?.params, authRegistration?.errors);
      }
    })(SignUpFormComponent)
  )
);

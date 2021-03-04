import React from 'react';
import { Button, Form, Input, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { AntdFormHelper } from '@axmit/antd-helpers';
import { EAuthFormError } from 'entities/Auth/Auth.models';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';

type AllProps = IAuthConnectedProps;

class LoginFormComponent extends React.PureComponent<AllProps> {
  render() {
    return (
      <>
        <Form className="mb-5" onFinish={this.login}>
          <Form.Item className="mb-6" name="email" rules={[{ required: true, message: EAuthFormError.Email }]}>
            <Input type="email" size="large" placeholder="Email" />
          </Form.Item>

          <Form.Item className="mb-6" name="password" rules={[{ required: true, message: EAuthFormError.Password }]}>
            <Input type="password" size="large" placeholder="Password" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button type="danger" size="large" htmlType="submit" block={true}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Row className="mb-3" justify="center" align="middle">
          <Typography.Text className="fs-xxs">Have no account?</Typography.Text>&nbsp;
          <Link className="cursor-pointer" to="/signup">
            <Typography.Text className="fs-xxs color-blue">SignUp</Typography.Text>
          </Link>
        </Row>

        <Row justify="center" align="middle">
          <Link className="cursor-pointer" to="/restore-password">
            <Typography.Text className="fs-xxs color-blue cursor-pointer">Forgot password?</Typography.Text>
          </Link>
        </Row>
      </>
    );
  }

  login = e => {
    e.preventDefault();

    const { form, addAuthModel } = this.props;
    const { validateFields } = form;

    validateFields((err, values) => {
      if (!err) {
        addAuthModel({ ...values });
      }
    });
  };
}

export const LoginPage = communicationAuth.injector(
  Form.create({
    mapPropsToFields(props: AllProps) {
      const { authModel } = props;

      return AntdFormHelper.mapValidationToFields(authModel?.params, authModel?.errors);
    }
  })(LoginFormComponent)
);

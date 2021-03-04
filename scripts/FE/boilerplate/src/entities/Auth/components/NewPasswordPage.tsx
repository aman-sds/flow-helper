import React from 'react';
import { Button, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { AntdFormHelper } from '@axmit/antd-helpers';
import { RouteComponentProps } from 'react-router-dom';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';
import { EAuthFormError } from 'entities/Auth/Auth.models';

interface IParams {
  code?: string;
}
type AllProps = IAuthConnectedProps & FormComponentProps & RouteComponentProps<IParams>;

class NewPasswordFormComponent extends React.PureComponent<AllProps> {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form className="mb-5" onSubmit={this.passwordNew}>
        <Form.Item label="Password:">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: EAuthFormError.Password }]
          })(<Input placeholder="Password" type="password" />)}
        </Form.Item>

        <Button type="danger" size="large" htmlType="submit" block={true}>
          Отправить
        </Button>
      </Form>
    );
  }

  passwordNew = () => {
    const { form, updateAuthPasswordRestore, match } = this.props;
    const { code } = match.params;
    const { validateFields } = form;

    validateFields((err, values) => {
      if (!err) {
        updateAuthPasswordRestore({ ...values, code: code });
      }
    });
  };
}

export const NewPasswordPage = communicationAuth.injector(
  Form.create({
    mapPropsToFields(props: AllProps) {
      const { authModel } = props;
      // todo add error for password dont work, double nesting error{error}
      return AntdFormHelper.mapValidationToFields(authModel?.params, authModel?.errors);
    }
  })(NewPasswordFormComponent)
);

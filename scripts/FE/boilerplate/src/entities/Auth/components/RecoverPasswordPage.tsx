import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Form, Input, Row, Typography } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { communicationAuth, IAuthConnectedProps } from 'entities/Auth/Auth.communication';
import { EAuthFormError } from 'entities/Auth/Auth.models';
import { communicationUI, IUIConnectedProps } from 'entities/UI/UI.communication';
import { EAuthModalType } from 'entities/UI/UI.models';

type AllProps = FormComponentProps & IAuthConnectedProps & RouteComponentProps & IUIConnectedProps;

class RecoverPasswordFormComponent extends React.PureComponent<AllProps> {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <Form className="mb-5" onSubmit={this.passwordRecover}>
          <Row className="fs mb-6">
            <Typography.Text className="fs-xxs">
              Введите ваш email и мы отправим на него инструкцию по восстановлению пароля.
            </Typography.Text>
          </Row>

          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: EAuthFormError.Email
                }
              ]
            })(<Input placeholder="Email" type="email" size="large" />)}
          </Form.Item>

          <Button type="danger" size="large" htmlType="submit" block={true}>
            Отправить
          </Button>
        </Form>

        <Row type="flex" justify="center" align="middle">
          <div onClick={() => this.openAuthModal(EAuthModalType.Login)}>
            <Typography.Text className="color-blue cursor-pointer">Войти</Typography.Text>
          </div>
        </Row>
      </>
    );
  }

  openAuthModal = (type: EAuthModalType) => {
    const { openUIAuthModal } = this.props;

    openUIAuthModal({ modalType: type });
  };

  passwordRecover = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { form, addAuthPasswordRestore } = this.props;
    const { validateFields } = form;

    validateFields((err, values) => {
      if (!err) {
        addAuthPasswordRestore({ ...values });
      }
    });
  };
}

export const RecoverPasswordPage = Form.create()(
  communicationAuth.injector(communicationUI.injector(withRouter(RecoverPasswordFormComponent)))
);

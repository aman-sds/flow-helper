import React, { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import { Button, Card, Checkbox, Form, Input, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { AntdFormHelper } from '@axmit/antd-helpers';
import LayoutBasic from 'common/components/Layouts/LayoutBasic';
import { PrivateLayout } from 'common/components/Layouts/PrivateLayout';
import { ELocationType, parseLocation } from 'common/helpers/location.helper';
import { CardHeader } from 'common/components/Card/CardHeader';
import { LoadingSpin } from 'common/components/LoadingSpin';
import { ImageUpload } from 'common/components/Image/ImageUpload';
import { communicationAuth, EAuthFormError, ESocialType, IAuthConnectedProps, ISocialRegistrationModel } from 'entities/Auth';
import { communicationUser, IUserConnectedProps } from 'entities/User/User.communication';
import { getSocialAuthData } from 'entities/Auth/helpers/socialAuth.helper';
import { ESocialLinkCallbackMessage, IUserLocationModel } from 'entities/User/User.models';

interface IComponentState {
  selectedLocation?: IUserLocationModel;
}

type AllProps = IUserConnectedProps & IAuthConnectedProps & FormComponentProps;

class UserEditPageComponent extends React.Component<AllProps, IComponentState> {
  state: IComponentState = { selectedLocation: undefined };

  render() {
    const { form, authModel, authUser } = this.props;
    const { loading } = authUser;
    const { data: authModelData } = authModel;
    const currentUserId = authModelData?.access?.userId;
    const token = authModelData?.access?.token;
    const { getFieldDecorator, getFieldValue } = form;
    const location = getFieldValue('location') || '';

    return (
      <PrivateLayout>
        <LayoutBasic>
          <CardHeader>
            <h1 className="basic-text m-0">Редактирование профиля</h1>
          </CardHeader>

          <Card className="user__card rounded mb-11" bordered bodyStyle={{ padding: 0 }}>
            {loading ? (
              <LoadingSpin />
            ) : (
              <Row gutter={{ sm: 24 }}>
                <Form className="form" onSubmit={this.updateUser}>
                  <Col xs={24} sm={24} md={8} lg={6}>
                    <Row type="flex" justify="center">
                      <Form.Item>{getFieldDecorator('imageId')(<ImageUpload token={token} />)}</Form.Item>
                    </Row>
                  </Col>
                  <Col xs={24} md={16} lg={18}>
                    <Form.Item label="ФИО:">
                      {getFieldDecorator('fullName', {
                        rules: [
                          {
                            message: EAuthFormError.FullName
                          }
                        ]
                      })(<Input size="large" placeholder="Ваше имя" />)}
                    </Form.Item>

                    <Form.Item label="Пароль:">
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            message: EAuthFormError.Password
                          }
                        ]
                      })(<Input.Password size="large" placeholder="Пароль" type="password" />)}
                    </Form.Item>

                    <Form.Item label="Email:">
                      {getFieldDecorator('email', {
                        rules: [
                          {
                            type: 'email',
                            message: EAuthFormError.IncorrectEmail
                          },
                          {
                            message: EAuthFormError.Email
                          }
                        ]
                      })(<Input size="large" placeholder="Email" type="email" />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('viewEmail', {
                        initialValue: false,
                        valuePropName: 'checked'
                      })(<Checkbox>Показывать другим пользователям</Checkbox>)}
                    </Form.Item>

                    <Form.Item label="Телефон:">
                      {getFieldDecorator('phone')(<Input size="large" placeholder="+7-000-000-00-00" type="tel" />)}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('viewPhone', {
                        initialValue: false,
                        valuePropName: 'checked'
                      })(<Checkbox>Показывать другим пользователям</Checkbox>)}
                    </Form.Item>

                    <Form.Item label="Мой регион:">
                      <Autocomplete
                        className="ant-input ant-input-lg" // todo class name for styling auto complete like a ANTD input
                        placeholder="Укажите Ваш регион"
                        defaultValue={location}
                        onPlaceSelected={this.changeLocation}
                        types={['(regions)']}
                      />
                    </Form.Item>

                    <Form.Item label="Сайт:">
                      {getFieldDecorator('website')(<Input size="large" placeholder="www.example.com" type="site" />)}
                    </Form.Item>

                    <Form.Item label="Обо мне:">
                      {getFieldDecorator('about')(<Input.TextArea placeholder="Напишите что-нибудь о себе..." />)}
                    </Form.Item>

                    <Form.Item label="ВКонтакте:">
                      {getFieldDecorator('vkLink', {
                        rules: [
                          {
                            validator(_: any, value: string, callback: any) {
                              const regexp = /^(?:http(s)?:\/\/)?(vkontakte|vk)\.com\/(id[0-9]*|[a-z, A-Z][a-z, A-Z,0-9]*)/;

                              if (value && !value.match(regexp)) {
                                callback(ESocialLinkCallbackMessage.TextLink);
                              }

                              callback();
                            }
                          }
                        ]
                      })(<Input size="large" placeholder="http(s)://vk.com" />)}
                    </Form.Item>

                    <Form.Item label="Facebook:">
                      {getFieldDecorator('fbLink', {
                        rules: [
                          {
                            validator(_: any, value: string, callback: any) {
                              const regexp = /^(?:http(s)?:\/\/)?(facebook|fb)\.com\/[A-z0-9_\-.]+\/?/;

                              if (value && !value.match(regexp)) {
                                callback(ESocialLinkCallbackMessage.TextLink);
                              }

                              callback();
                            }
                          }
                        ]
                      })(<Input size="large" placeholder="http(s)://fb.com" />)}
                    </Form.Item>

                    <Form.Item label="Twitter:">
                      {getFieldDecorator('twitterLink', {
                        rules: [
                          {
                            validator(_: any, value: string, callback: any) {
                              const regexp = /^(?:http(s)?:\/\/)?twitter\.com\/[A-z0-9_]+\/?/;

                              if (value && !value.match(regexp)) {
                                callback(ESocialLinkCallbackMessage.TextLink);
                              }

                              callback();
                            }
                          }
                        ]
                      })(<Input size="large" placeholder="http(s)://twitter.com" />)}
                    </Form.Item>

                    <Form.Item label="Одноклассники:">
                      {getFieldDecorator('okLink', {
                        rules: [
                          {
                            validator(_: any, value: string, callback: any) {
                              const regexp = /^(?:http(s)?:\/\/)?(odnoklassniki|ok)\.ru\/[A-z0-9_]+\/?/;

                              if (value && !value.match(regexp)) {
                                callback(ESocialLinkCallbackMessage.TextLink);
                              }

                              callback();
                            }
                          }
                        ]
                      })(<Input size="large" placeholder="http(s)://ok.ru" />)}
                    </Form.Item>

                    <Row type="flex" justify="end" align="middle">
                      <Col xs={{ span: 24, order: 1 }} sm={{ span: 8, order: 2 }}>
                        <Button className="user-edit__button_save" size="large" type="danger" htmlType="submit" block>
                          Сохранить
                        </Button>
                      </Col>

                      <Col xs={{ span: 24, order: 2 }} sm={{ span: 8, order: 1 }}>
                        <Button className="button__secondary" size="large" type="link" block>
                          <Link to={`/users/${currentUserId}`}>Отмена</Link>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Form>
              </Row>
            )}
          </Card>
        </LayoutBasic>
      </PrivateLayout>
    );
  }

  changeLocation = (place: any) => {
    this.setState({
      selectedLocation: {
        region: parseLocation(place, ELocationType.RegionLevelOne) || parseLocation(place, ELocationType.RegionLevelTwo),
        country: parseLocation(place, ELocationType.Country),
        city: parseLocation(place, ELocationType.City),
        lat: place.geometry.location.lat() || '',
        lon: place.geometry.location.lng() || '',
        placeId: place.place_id || ''
      }
    });
  };

  updateUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { form, updateAuthUser, authUser } = this.props;
    const { selectedLocation } = this.state;
    const { validateFields } = form;
    const userId = authUser?.data?.id || '';

    validateFields((err, values) => {
      const { imageId, website, password, vkLink, fbLink, twitterLink, okLink, viewEmail, viewPhone, ...updateData } = values;

      const arrLinks: { type: string; link: string }[] = [
        { type: 'vkontakte', link: this.transformLink(vkLink) },
        { type: 'facebook', link: this.transformLink(fbLink) },
        { type: 'ok', link: this.transformLink(okLink) },
        { type: 'twitter', link: this.transformLink(twitterLink) },
        { type: 'website', link: this.transformLink(website) }
      ];
      const socialLinks: { type: string; link: string }[] = [];
      const passwordValue = password || undefined;

      for (const item of arrLinks) {
        if (item.link) {
          socialLinks.push(item);
        }
      }
      // todo BE need null for imageId as string
      if (!err) {
        updateAuthUser({
          data: {
            ...updateData,
            viewEmail,
            viewPhone,
            password: passwordValue,
            socialLinks,
            location: selectedLocation,
            imageId: imageId || 'null'
          },
          id: userId
        });
      }
    });
  };

  bindVk = () => {
    const { updateUserSocial } = this.props;
    const { authUser } = this.props;
    const userId = authUser?.data?.id || '';
    getSocialAuthData(ESocialType.Vk).then((data: ISocialRegistrationModel) => {
      updateUserSocial({ id: userId, data: data.social });
    });
  };

  bindGoogle = () => {
    const { updateUserSocial } = this.props;
    const { authUser } = this.props;
    const userId = authUser?.data?.id || '';
    getSocialAuthData(ESocialType.Google).then((data: ISocialRegistrationModel) => {
      updateUserSocial({ id: userId, data: data.social });
    });
  };

  bindFacebook = () => {
    const { updateUserSocial } = this.props;
    const { authUser } = this.props;
    const userId = authUser?.data?.id || '';
    getSocialAuthData(ESocialType.Facebook).then((data: ISocialRegistrationModel) => {
      updateUserSocial({ id: userId, data: data.social });
    });
  };

  transformLink = (link: string): string => (!link || link.includes('http') || link.includes('https') ? link : `https://${link}`);
}

export const UserEditPage = communicationUser.injector(
  communicationAuth.injector(
    Form.create({
      mapPropsToFields(props: AllProps) {
        const { authUser } = props;
        const userData = authUser?.data;
        const userError = authUser?.errors;
        const country = userData?.location?.country;
        const region = userData?.location?.region;
        const city = userData?.location?.city;
        const location = city || region || country || '';
        const website = userData?.socialLinks?.find(socialLink => socialLink.type === 'website');
        const vkLink = userData?.socialLinks?.find(socialLink => socialLink.type === 'vkontakte');
        const fbLink = userData?.socialLinks?.find(socialLink => socialLink.type === 'facebook');
        const twitterLink = userData?.socialLinks?.find(socialLink => socialLink.type === 'twitter');
        const okLink = userData?.socialLinks?.find(socialLink => socialLink.type === 'ok');

        return AntdFormHelper.mapValidationToFields(
          {
            ...userData,
            password: '',
            location,
            imageId: userData?.file?.id,
            website: website?.link,
            vkLink: vkLink?.link,
            fbLink: fbLink?.link,
            twitterLink: twitterLink?.link,
            okLink: okLink?.link
          },
          userError
        );
      }
    })(UserEditPageComponent)
  )
);

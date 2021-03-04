import { IValidateHelperErrorReturnData } from "common/models/validateHelperModels";

interface AnyKeys {
  [prop: string]: any;
}
export interface IAuthModel extends AnyKeys {} // Components.Schemas.LoginBody {}
export interface ITokenModel extends AnyKeys {} // Components.Schemas.AuthResponse {}
export interface ITokenModelData extends AnyKeys {} // Components.Schemas.TokenData {}
export interface IConfirmCodeModel extends AnyKeys {} // Components.Schemas.ActivateCodeBody {}
export interface ISocialRegistrationModel extends AnyKeys {} // Components.Schemas.UserSocialRegistration {}
export interface ISignUpModel extends AnyKeys {} // Components.Schemas.UserRegistration {}

export interface IAuthRegistrationModel extends IValidateHelperErrorReturnData {
  data: null;
}

export interface IRestorePasswordModel {
  code: string;
  password: string;
}

export enum ESocialType {
  Vk = 'vk',
  Google = 'google',
  Facebook = 'facebook'
}

export enum EAuthRoutes {
  Login = '/login',
  SignUp = '/signup',
  PasswordRecover = '/password-recover',
  NewPassword = '/new-password'
}

export enum EAuthFormError {
  Email = "Email can't be empty",
  IncorrectEmail = 'Email incorrect',
  FullName = 'Name is incorrect',
  Password = 'Please set a password',
  Code = 'Please enter the code'
}

export enum EAuthSuccessMessage {
  ChangeDataSuccess = 'Success',
  CheckEmailForConfirmedLink = 'Please check your email',
  AccountConfirmed = 'Success',
  ChangePasswordSuccess = 'Password changed'
}

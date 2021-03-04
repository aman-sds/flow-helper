import { ESocialType, ISocialRegistrationModel } from 'entities/Auth/Auth.models';

function assertNever(data: never): never {
  throw new Error(`Do not expect to get here ${data}`);
}

export function getSocialAuthData(socialType: ESocialType): Promise<any> {
  switch (socialType) {
    case ESocialType.Facebook:
      return new Promise(Facebook);

    case ESocialType.Google:
      return new Promise(Google);

    case ESocialType.Vk:
      return new Promise(Vk);

    default:
      return assertNever(socialType);
  }
}

function Facebook(resolve: any, reject: any) {
  FB.login(() => {
    FB.api('/me', { fields: 'email, name' }, (response: IFacebookResponseModel) => {
      if (response) {
        const dataObject: ISocialRegistrationModel = {
          fullName: response.name,
          email: response.email,
          social: {
            id: response.id,
            type: ESocialType.Facebook
          }
        };
        resolve(dataObject);
      } else {
        reject(new Error('Fb auth failed'));
      }
    });
  });
}

function Google(resolve: any, reject: any) {
  const GoogleAuth = gapi.auth2.getAuthInstance();
  if (GoogleAuth) {
    const options = {
      scope: 'profile email'
    };
    GoogleAuth.signIn(options).then((user: gapi.auth2.GoogleUser) => {
      if (user) {
        const dataObject: ISocialRegistrationModel = {
          fullName: user.getBasicProfile().getName(),
          email: user.getBasicProfile().getEmail(),
          social: {
            id: user.getBasicProfile().getId(),
            type: ESocialType.Google
          }
        };
        resolve(dataObject);
      } else {
        reject(new Error('Google auth failed'));
      }
    });
  }
}

function Vk(resolve: any, reject: any) {
  // @ts-ignore
  const VK = window.VK;
  VK.Auth.login((response: IVkResponseModel) => {
    if (response) {
      const dataObject: ISocialRegistrationModel = {
        fullName: `${response.session.user.first_name} ${response.session.user.last_name}`,
        social: {
          id: response.session.user.id,
          type: ESocialType.Vk
        }
      };
      resolve(dataObject);
    } else {
      reject(new Error('Vk auth failed'));
    }
  });
}
interface IVkResponseModel {
  session: {
    expire: number;
    mid: number;
    secret: string;
    sid: string;
    user: {
      domain: string;
      first_name: string;
      href: string;
      id: string;
      last_name: string;
      nickname: string;
    };
  };
  status: {
    id: string;
    type: string;
  };
}

interface IFacebookResponseModel {
  id: string;
  name: string;
  email: string;
}

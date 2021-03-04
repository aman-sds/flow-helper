interface AnyKeys {
  [prop: string]: any;
}
export interface IUserModel extends AnyKeys {} // uncomment to work with API models // extends Components.Schemas.UserResponseWithFollow {}
export interface IUserNestedModel extends AnyKeys {} // extends Components.Schemas.UserNestedResponse {}
export interface IAuthUser extends AnyKeys {} // extends Components.Schemas.UserFullResponse {}
export interface IUserUpdateModel extends AnyKeys {} // extends Components.Schemas.UserUpdate {}
export interface IUserLocationModel extends AnyKeys {} // extends Components.Schemas.LocationWithRegionCreate {}
export interface IUserAdminUpdate extends AnyKeys {} // extends Components.Schemas.AdminUpdate {}
export interface ISocialLinkItem extends AnyKeys {} // extends Components.Schemas.SocialLinkItem {}
export interface IUserCollection extends AnyKeys {} // extends Components.Schemas.UserCollectionResponse {}
export interface IUserCollectionQueryParams extends AnyKeys {} // extends Components.Schemas.UserListQueryParams {}
export interface IUserQueryParams extends AnyKeys {} // extends Components.Schemas.UserQueryParams {}
export interface ISocialModel extends AnyKeys {} // extends Components.Schemas.SocialBody {}

export enum EUserRoles {
  Admin = 'admin',
  RegularUser = 'regular',
  Moderator = 'moderator'
}

export enum EUserLevels {
  Beginner = 'beginner',
  Advanced = 'advanced',
  Veteran = 'veteran'
}

export enum EUserStatus {
  Banned = 'banned',
  ActiveUser = 'active',
  NewUser = 'new'
}

export enum ESocialLinkCallbackMessage {
  TextLink = 'Данная ссылка не является корректной'
}

export enum EDetailsFeedTabKeys {
  All = 'all',
  Problems = 'problems',
  Actions = 'actions',
  News = 'news',
  Posts = 'posts',
  Subscription = 'subscription',
  Drafts = 'drafts',
  Blocked = 'blocked',
  Moderation = 'moderation'
}

export enum EDetailsFeedTabName {
  All = 'Все',
  News = 'Новости',
  Posts = 'Посты',
  Problems = 'Проблемы',
  Actions = 'Акции',
  Moderation = 'На модерации',
  Drafts = 'Черновики',
  Blocked = 'Заблокированные'
}

export enum ECommunityTabs {
  Groups = 'Группы',
  Users = 'Участники'
}

export enum ECommunityTabKeys {
  Groups = 'groups',
  Users = 'users'
}

export interface UserModel {
  id: string,
  mail: string,
  creationDate: string,
  role: UserRole
}

export enum UserRole {
  techAdministrator = 0,
  nebraskaAdministrator = 1,
  contributor = 2
}


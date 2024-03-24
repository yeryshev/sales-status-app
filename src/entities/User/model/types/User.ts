export interface User {
  id: number
  username: string
  email: string
  firstName: string
  secondName: string
  photoUrl: string
  extNumber: string
  insideId: number
  telegram: string
  isWorkingRemotely: boolean
  statusId: number
  commentId: number | null
}

export interface UserSchema {
  user?: User
  loading: boolean;
  error: null | string;
  authData?: User
  mounted: boolean
}
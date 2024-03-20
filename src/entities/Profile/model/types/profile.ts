export interface Profile {
  firstName?: string
  secondName?: string
  email?: string
  photoUrl?: string
  extNumber?: string
  telegram?: string
  isWorkingRemotely?: boolean
}

export interface ProfileSchema {
  data?: Profile
  form?: Profile
  isLoading: boolean
  error?: string
  readonly: boolean
}
import { type User } from '../../app/types/User'

export interface UserState { user: User | null, loading: boolean, error: null | string }

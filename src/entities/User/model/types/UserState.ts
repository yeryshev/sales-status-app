import { type User } from './User';

export interface UserState {
    user: User | null;
    loading: boolean;
    error: null | string;
}

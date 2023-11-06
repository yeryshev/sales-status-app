import { User } from '../../types/User';

export type UserState = { user: User | null; loading: boolean; error: null | string };

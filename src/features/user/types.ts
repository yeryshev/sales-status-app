import { User } from '../../app/types/User';

export type UserState = { user: User | null; loading: boolean; error: null | string };

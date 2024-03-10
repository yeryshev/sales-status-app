import { type Status } from './Status';

export interface StatusSchema {
    value: Status | null;
    loading: boolean;
    error: null | string;
}

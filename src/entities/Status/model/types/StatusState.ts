import { type Status } from './Status';

export interface StatusState {
    value: Status | null;
    loading: boolean;
    error: null | string;
}

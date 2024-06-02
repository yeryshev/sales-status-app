import { type Status } from './Status';

export interface StatusSchema {
  data: Status | null;
  loading: boolean;
  error: null | string;
}

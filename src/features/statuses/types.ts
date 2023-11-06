import { Status } from '../../types/Status';

export type StatusState = {
  value: Status | null;
  loading: boolean;
  error: null | string;
};

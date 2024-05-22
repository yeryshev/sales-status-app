import { type Teammate } from './teammate';

export interface TeamTableSchema {
  list: Teammate[];
  loading: boolean;
  error: string | null;
}

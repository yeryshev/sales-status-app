import { Teammate } from './../../types/Team';
export type TeamState = {
  list: Teammate[];
  loading: boolean;
  error: string | null;
};

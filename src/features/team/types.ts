import { Teammate } from '../../app/types/Team';
export type TeamState = {
  list: Teammate[];
  loading: boolean;
  error: string | null;
};

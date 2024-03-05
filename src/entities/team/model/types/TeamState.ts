import { type Teammate } from './Team';
export interface TeamState {
    list: Teammate[];
    loading: boolean;
    error: string | null;
}

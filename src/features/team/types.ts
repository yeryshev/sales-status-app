import { type Teammate } from '../../app/types/Team'
export interface TeamState {
  list: Teammate[]
  loading: boolean
  error: string | null
}

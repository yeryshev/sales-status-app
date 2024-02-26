import { type Status } from '../../app/types/Status'

export interface StatusState {
  value: Status | null
  loading: boolean
  error: null | string
}

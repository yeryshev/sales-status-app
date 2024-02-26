import { type Task } from '../../app/types/Task'

export interface TasksState {
  list: Task[]
  loading: boolean
  error: string | null
}

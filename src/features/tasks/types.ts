import { Task } from '../../types/Task';

export type TasksState = {
  list: Task[];
  loading: boolean;
  error: string | null;
};

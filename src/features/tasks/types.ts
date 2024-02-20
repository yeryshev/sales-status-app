import { Task } from '../../app/types/Task';

export type TasksState = {
  list: Task[];
  loading: boolean;
  error: string | null;
};

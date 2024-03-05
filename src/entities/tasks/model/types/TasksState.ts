import { type Task } from './Task';

export interface TasksState {
    list: Task[];
    loading: boolean;
    error: string | null;
}

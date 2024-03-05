import { CommentsState } from '@/entities/comments/model/types/CommentsState';
import { StatusState } from '@/entities/Status';
import { TasksState } from '@/entities/tasks/model/types/TasksState';
import { TeamState } from '@/entities/team/model/types/TeamState';
import { UserState } from '@/entities/user/model/types/UserState';

export interface StateSchema {
    team: TeamState;
    user: UserState;
    comments: CommentsState;
    tasks: TasksState;
    status: StatusState;
}

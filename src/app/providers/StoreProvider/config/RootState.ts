import { CommentsState } from '@/entities/comments/model/types/CommentsState';
import { StatusState } from '@/entities/Status';
import { TeamState } from '@/entities/team/model/types/TeamState';
import { UserState } from '@/entities/Users/model/types/UserState';

export interface RootState {
    team: TeamState;
    user: UserState;
    comments: CommentsState;
    status: StatusState;
}

import { CommentsState } from '@/entities/Comment';
import { StatusState } from '@/entities/Status';
import { TeamState } from '@/entities/Teammate';
import { UserState } from '@/entities/User';

export interface RootState {
    team: TeamState;
    user: UserState;
    comments: CommentsState;
    status: StatusState;
}

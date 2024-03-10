import { CommentsSchema } from '@/entities/Comment';
import { StatusSchema } from '@/entities/Status';
import { TeamState } from '@/entities/Teammate';
import { UserSchema } from '@/entities/User';
import { LoginSchema } from '@/features/AuthByEmail';

export interface StateSchema {
    team: TeamState;
    user: UserSchema;
    comments: CommentsSchema;
    status: StatusSchema;
    loginForm: LoginSchema;
}

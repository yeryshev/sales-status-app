import { type Comment } from './Comment';

export interface CommentsState {
    list: Comment[];
    fullList: Comment[];
    loading: boolean;
    error: string | null;
}

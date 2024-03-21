import { type Comment } from './Comment';

export interface CommentsSchema {
    list: Comment[];
    fullList: Comment[];
    loading: boolean;
    error: string | null;
}

import { Comment } from '../../types/Comment';

export type CommentsState = {
  list: Comment[];
  loading: boolean;
  error: string | null;
};

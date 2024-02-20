import { Comment } from '../../app/types/Comment';

export type CommentsState = {
  list: Comment[];
  fullList: Comment[];
  loading: boolean;
  error: string | null;
};

import { Comment } from '@/entities/Comment';

export interface SelectCommentFromSchema {
  commentItem?: Comment;
  commentSelectValue?: string;
  error?: string;
}
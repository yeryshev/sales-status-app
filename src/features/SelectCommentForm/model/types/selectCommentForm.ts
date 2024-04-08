import { Comment } from '@/entities/Comment';

export interface SelectCommentFromSchema {
  commentSelectItem?: Comment;
  error?: string;
}
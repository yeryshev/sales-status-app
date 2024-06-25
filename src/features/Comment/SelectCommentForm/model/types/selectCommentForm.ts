import { Comment } from '@/entities/Comment';

export interface SelectCommentFormSchema {
  commentSelectItem?: Comment;
  error?: string;
}

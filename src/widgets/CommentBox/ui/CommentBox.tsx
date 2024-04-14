import { memo } from 'react';
import { AddCommentForm } from '@/features/AddCommentForm';
import { SelectCommentForm } from '@/features/SelectCommentForm';
import FormLabel from '@mui/material/FormLabel';

export const CommentBox = memo(() => {
  return (
    <FormLabel id="comments-label">
      Комментарии
      <AddCommentForm />
      <SelectCommentForm />
    </FormLabel>
  );
});

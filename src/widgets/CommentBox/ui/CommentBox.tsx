import { memo } from 'react';
import { AddCommentForm } from 'src/features/Comment/AddCommentForm';
import { SelectCommentForm } from 'src/features/Comment/SelectCommentForm';
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

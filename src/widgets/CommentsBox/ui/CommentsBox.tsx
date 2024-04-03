import { memo } from 'react';
import { AddCommentForm } from '@/features/AddCommentForm';
import { SelectComment } from '@/features/SelectComment';
import FormLabel from '@mui/material/FormLabel';

export const CommentsBox = memo(() => {
    return (
        <FormLabel id="comments-label">
                Комментарии
            <AddCommentForm />
            <SelectComment />
        </FormLabel>
    );
});

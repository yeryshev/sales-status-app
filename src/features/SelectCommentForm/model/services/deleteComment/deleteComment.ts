import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Comment } from '@/entities/Comment';
import { commentsActions } from '@/widgets/CommentBox/model/slice/commentBoxSlice';

export const deleteComment = createAsyncThunk<
  Comment,
  Comment['id'],
  ThunkConfig<string>
>(
    'manageComment/deleteComment',
    async (commentId, thunkAPI) => {
        const { extra, rejectWithValue, dispatch } = thunkAPI;

        if (!commentId) {
            return rejectWithValue('Не заполнено обязательное поле');
        }

        try {
            const response = await extra.api.delete<Comment>(`/comments/${commentId}`);

            if (!response.data) {
                throw new Error('Произошла ошибка при удалении комментария');
            }

            dispatch(commentsActions.deleteComment(commentId));

            return response.data;
        } catch (error) {
            return rejectWithValue('Что-то пошло не так');
        }
    },
);
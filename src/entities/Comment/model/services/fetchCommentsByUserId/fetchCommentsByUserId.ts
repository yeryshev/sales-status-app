import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Comment } from '../../types/Comment';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User } from '@/entities/User';

export const fetchCommentsByUserId = createAsyncThunk<
  Comment[],
  User['id'],
  ThunkConfig<string>
>(
    'comments/fetchCommentsByUserId',
    async (userId, thunkAPI) => {
        const { extra, rejectWithValue } = thunkAPI;

        try {
            const response = await extra.api.get<Comment[]>(`/comments/?user=${userId}`);

            if (!response.data) {
                throw new Error('Произошла ошибка при загрузке комментариев');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue('Что-то пошло не так');
        }
    },
);

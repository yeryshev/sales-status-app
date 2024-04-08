import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Comment } from '../../types/Comment';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const fetchAllComments = createAsyncThunk<
  Comment[],
  void,
  ThunkConfig<string>
>(
    'comments/fetchAllComments',
    async (_, thunkAPI) => {
        const { extra, rejectWithValue } = thunkAPI;

        try {
            const response = await extra.api.get<Comment[]>('/comments');

            if (!response.data) {
                throw new Error('Произошла ошибка при загрузке комментариев');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue('Что-то пошло не так');
        }
    },
);
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Comment } from '../../types/Comment';

export const addComment = createAsyncThunk<Comment, Comment['description'], ThunkConfig<string>>(
  'comments/addComment',
  async (text, thunkAPI) => {
    const { extra, rejectWithValue } = thunkAPI;

    if (!text) {
      return rejectWithValue('Не заполнено обязательное поле');
    }

    try {
      const response = await extra.api.post<Comment>('/comments', {
        description: text,
      });

      if (!response.data) {
        throw new Error('Произошла ошибка при добавлении комментария');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue('Что-то пошло не так');
    }
  },
);

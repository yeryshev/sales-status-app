import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Teammate } from '../../types/teammate';

export const fetchTeamList = createAsyncThunk<Teammate[], void, ThunkConfig<string>>(
  'team/fetchTeamList',
  async (_, thunkAPI) => {
    const { extra, rejectWithValue } = thunkAPI;

    try {
      const response = await extra.api.get<Teammate[]>('/users/');

      if (!response.data) {
        throw new Error('Произошла ошибка при загрузке списка коллег');
      }

      return response.data;
    } catch {
      return rejectWithValue('Что-то пошло не так');
    }
  },
);

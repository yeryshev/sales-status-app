import { createAsyncThunk } from '@reduxjs/toolkit';
import { UsersMango } from '../../types/tasksWebsocket';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const fetchMangoStates = createAsyncThunk<
  UsersMango,
  void,
  ThunkConfig<string>
>(
    'team/fetchMangoStates',
    async (_, thunkAPI) => {
        const { extra, rejectWithValue } = thunkAPI;

        try {
            const url = import.meta.env.VITE_MANGO_REDIS_URL;
            const response = await extra.api.get<UsersMango>(url);

            if (!response.data) {
                throw new Error('Произошла ошибка при загрузке статусов из манго');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue('Что-то пошло не так');
        }
    });
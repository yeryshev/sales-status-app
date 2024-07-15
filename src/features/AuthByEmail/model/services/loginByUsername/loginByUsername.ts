import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { checkUser, userActions } from '@/entities/User';
import { ThunkConfig } from '@/app/providers/StoreProvider';

interface LoginByUsernameProps {
  username: string;
  password: string;
}

const enum LoginStatusCodes {
  BAD_CREDENTIALS = 400,
  VALIDATION_ERROR = 422,
}

export const loginByUsername = createAsyncThunk<string, LoginByUsernameProps, ThunkConfig<string>>(
  'login/loginByUsername',
  async (authData, thunkAPI) => {
    const { extra, rejectWithValue, dispatch } = thunkAPI;

    try {
      const url = '/auth/login';

      const formData = new FormData();
      formData.set('username', authData.username);
      formData.set('password', authData.password);

      const requestConfig: AxiosRequestConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      };

      const response = await extra.api.post(url, formData, requestConfig);

      const user = await dispatch(checkUser()).unwrap();
      user && dispatch(userActions.setAuthData(user));

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === LoginStatusCodes.VALIDATION_ERROR) {
          return rejectWithValue('Некорректно заполнены обязательные поля');
        }
        if (status === LoginStatusCodes.BAD_CREDENTIALS) {
          return rejectWithValue('Неверный логин или пароль');
        }
      }
      return rejectWithValue('Что-то пошло не так');
    }
  },
);

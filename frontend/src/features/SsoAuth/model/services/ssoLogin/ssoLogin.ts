import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { checkUser, userActions } from '@/entities/User';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { logger } from '@/shared/lib/utils/logger';

interface SsoLoginProps {
  email: string;
  name?: string;
  preferred_username?: string;
}

interface SsoLoginResponse {
  message: string;
  success: boolean;
  user: {
    id: number;
    email: string;
    first_name: string | null;
    second_name: string | null;
    is_active: boolean;
    is_superuser: boolean;
  };
}

export const ssoLogin = createAsyncThunk<SsoLoginResponse, SsoLoginProps, ThunkConfig<string>>(
  'sso/ssoLogin',
  async (ssoData, thunkAPI) => {
    const { extra, rejectWithValue, dispatch } = thunkAPI;

    try {
      const url = '/auth/sso-login';

      const requestData = {
        email: ssoData.email,
        name: ssoData.name || ssoData.preferred_username,
      };

      logger.log('Sending SSO login request:', requestData);

      const response = await extra.api.post<SsoLoginResponse>(url, requestData);

      logger.log('SSO login response:', response.data);

      // Проверяем успешность авторизации
      if (response.data.success) {
        logger.log('SSO login successful, user found:', response.data.user);

        // Проверяем пользователя после SSO авторизации (cookie уже установлен)
        const user = await dispatch(checkUser()).unwrap();
        if (user) {
          dispatch(userActions.setUserData(user));
          logger.log('User data loaded from server:', user);
        }
      }

      return response.data;
    } catch (error) {
      logger.error('SSO login error:', error);
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.detail || 'Ошибка авторизации';

        if (status === 404) {
          return rejectWithValue('Пользователь с таким email не найден в системе');
        }
        if (status === 403) {
          return rejectWithValue('Пользователь деактивирован');
        }
        if (status === 401) {
          return rejectWithValue('Ошибка авторизации через SSO');
        }
        return rejectWithValue(message);
      }
      return rejectWithValue('Ошибка при авторизации через SSO');
    }
  },
);

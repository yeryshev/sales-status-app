import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { checkUser } from '@/entities/User/model/actions/userActions.ts';
import { userActions } from '@/entities/User';

interface LoginByUsernameProps {
  username: string
  password: string
}

const enum LoginStatusCodes {
    BAD_CREDENTIALS = 400,
    VALIDATION_ERROR = 422,
}

export const loginByUsername = createAsyncThunk<string, LoginByUsernameProps, { rejectValue: string }>(
    'login/loginByUsername',
    async (authData, thunkAPI) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;

            const formData = new FormData();
            formData.set('username', authData.username);
            formData.set('password', authData.password);

            const requestConfig: AxiosRequestConfig = {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            };

            const response = await axios.post(
                url,
                formData,
                requestConfig
            );

            const user = await thunkAPI.dispatch(checkUser()).unwrap();
            user && thunkAPI.dispatch(userActions.setAuthData(user));

            return response.data;

        } catch (error) {
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status === LoginStatusCodes.VALIDATION_ERROR) {
                    return thunkAPI.rejectWithValue('Некорректно заполнены обязательные поля');
                }
                if (status === LoginStatusCodes.BAD_CREDENTIALS) {
                    return thunkAPI.rejectWithValue('Неверный логин или пароль');
                }
            }
            return thunkAPI.rejectWithValue('Что-то пошло не так');
        }
    }
);
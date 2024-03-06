import { type FormEvent } from 'react';
import axios, { type AxiosError } from 'axios';
import { type ValidationError } from './types';
import { checkUser } from '../../../../entities/Users/model/actions/userActions';
import { setUser } from '../../../../entities/Users/model/slice/userSlice';
import { type NavigateFunction } from 'react-router-dom';
import { AppDispatch } from '@/app/providers/StoreProvider';

export const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    dispatch: AppDispatch,
    navigate: NavigateFunction
) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set('username', event.currentTarget.email.value);
    formData.set('password', event.currentTarget.password.value);

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        );

        if (response.status === 200 || response.status === 204) {
            const user = await dispatch(checkUser());
            if (user) {
                dispatch(setUser(user));
                navigate('/');
            }
        }
    } catch (error) {
        const err = error as AxiosError<ValidationError>;
        if (err.response?.status === 400) {
            alert('Неверный логин или пароль');
        } else if (err.response?.status === 422) {
            const validationError: ValidationError = err.response.data;
            alert(validationError.detail[0].msg || 'Ошибка при заполнении полей');
        } else {
            alert('Что-то пошло не так');
        }
    }
};

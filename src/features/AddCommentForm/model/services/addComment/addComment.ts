import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Comment } from '@/entities/Comment';
import { getAddCommentFormText } from '../../selectors/addCommentFormSelectors';
import { addCommentFormActions } from '../../slices/addCommentFormSlice';

export const addComment = createAsyncThunk<
  Comment,
  void,
  ThunkConfig<string>
>(
    'addCommentForm/addComment',
    async (_, thunkAPI) => {
        const { extra, rejectWithValue, dispatch, getState } = thunkAPI;
        const text = getAddCommentFormText(getState());

        if (!text) {
            return rejectWithValue('Не заполнено обязательное поле');
        }

        try {
            const response = await extra.api.post<Comment>(
                '/comments',
                { description: text },
            );

            if (!response.data) {
                throw new Error('Произошла ошибка при добавлении комментария');
            }

            dispatch(addCommentFormActions.setText(''));

            return response.data;
        } catch (error) {
            return rejectWithValue('Что-то пошло не так');
        }
    },
);
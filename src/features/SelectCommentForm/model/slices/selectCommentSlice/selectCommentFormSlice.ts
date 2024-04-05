import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectCommentFromSchema } from '../../types/selectCommentForm';
import { Comment } from '@/entities/Comment';

const initialState: SelectCommentFromSchema = {
    commentItem: undefined,
    commentSelectValue: '',
};

export const selectCommentFormSlice = createSlice({
    name: 'selectCommentFormSlice',
    initialState,
    reducers: {
        setCommentItem: (state, action: PayloadAction<Comment | undefined>) => {
            state.commentItem = action.payload;
        },
        setCommentSelectValue: (state, action: PayloadAction<string>) => {
            state.commentSelectValue = action.payload;
        },
    },
});

export const { actions: selectCommentFormActions } = selectCommentFormSlice;
export const { reducer: selectCommentFormReducer } = selectCommentFormSlice;
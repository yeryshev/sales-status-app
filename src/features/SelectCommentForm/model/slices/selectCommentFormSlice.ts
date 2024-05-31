import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectCommentFormSchema } from '../types/selectCommentForm';
import { Comment } from '@/entities/Comment';

const initialState: SelectCommentFormSchema = {
  commentSelectItem: undefined,
};

export const selectCommentFormSlice = createSlice({
  name: 'selectCommentFormSlice',
  initialState,
  reducers: {
    setCommentItem: (state, action: PayloadAction<Comment | undefined>) => {
      state.commentSelectItem = action.payload;
    },
  },
});

export const { actions: selectCommentFormActions } = selectCommentFormSlice;
export const { reducer: selectCommentFormReducer } = selectCommentFormSlice;

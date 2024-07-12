import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StatusSelectorSchema } from '../types/statusSelector';
import { Status } from '@/entities/Status';

const initialState: StatusSelectorSchema = {
  statusSelectItem: undefined,
};

export const selectCommentFormSlice = createSlice({
  name: 'selectCommentFormSlice',
  initialState,
  reducers: {
    setStatusItem: (state, action: PayloadAction<Status | undefined>) => {
      state.statusSelectItem = action.payload;
    },
  },
});

export const { actions: statusSelectorActions } = selectCommentFormSlice;
export const { reducer: statusSelectorReducer } = selectCommentFormSlice;

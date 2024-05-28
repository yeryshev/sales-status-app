import { createSlice } from '@reduxjs/toolkit';
import { StatusSchema } from '../types/StatusSchema';

const initialState: StatusSchema = {
  value: null,
  loading: false,
  error: null,
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    changeStatus: (state, action) => {
      if (state.value?.id === action.payload) return;
      state.value = action.payload;
    },
  },
});

export const { actions: statusActions } = statusSlice;
export const { reducer: statusReducer } = statusSlice;

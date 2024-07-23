import { createSlice } from '@reduxjs/toolkit';
import { StatusSchema } from '../types/StatusSchema';

const initialState: StatusSchema = {
  data: null,
  loading: false,
  error: null,
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    changeStatus: (state, action) => {
      if (state.data?.id === action.payload) return;
      state.data = action.payload;
    },
  },
});

export const { actions: statusActions } = statusSlice;
export const { reducer: statusReducer } = statusSlice;

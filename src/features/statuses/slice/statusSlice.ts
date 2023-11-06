import { createSlice } from '@reduxjs/toolkit';
import { StatusState } from '../types';

const initialState: StatusState = {
  value: null,
  loading: false,
  error: null,
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    changeStatus: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { changeStatus } = statusSlice.actions;

export default statusSlice.reducer;

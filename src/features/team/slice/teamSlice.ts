import { TeamState } from '../types';
import { setTeam } from '../actions/teamActions';
import { createSlice } from '@reduxjs/toolkit';

const initialState: TeamState = {
  list: [],
  loading: false,
  error: null,
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setTeam.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(setTeam.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(setTeam.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      });
  },
});

export default teamSlice.reducer;

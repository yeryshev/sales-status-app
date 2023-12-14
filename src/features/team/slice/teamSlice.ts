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
  reducers: {
    setTeamLocal: (state, action) => {
      state.list = state.list
        .map((teammate) => {
          if (Number(teammate.id) === Number(action.payload.userId)) {
            if ('status' in action.payload) {
              teammate.status = action.payload.status;
            }
            if ('comment' in action.payload) {
              teammate.comment = action.payload.comment;
            }
            teammate.updatedAt = action.payload.updatedAt;
            teammate.isWorkingRemotely = action.payload.isWorkingRemotely;
          }
          return teammate;
        })
        .sort((a, b) => {
          const statusOrder = {
            online: 1,
            busy: 2,
            offline: 3,
          };

          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          } else {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
        });
    },
  },
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

export const { setTeamLocal } = teamSlice.actions;

export default teamSlice.reducer;

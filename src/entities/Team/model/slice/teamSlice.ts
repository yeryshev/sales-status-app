import { type TeamTableSchema } from '../types/teamTableSchema';
import { createSlice } from '@reduxjs/toolkit';
import { fetchTeamList } from '../services/fetchTeamList/fetchTeamList';

const initialState: TeamTableSchema = {
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
      .addCase(fetchTeamList.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchTeamList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamList.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      });
  },
});

export const { reducer: teamReducer } = teamSlice;
export const { actions: teamActions } = teamSlice;

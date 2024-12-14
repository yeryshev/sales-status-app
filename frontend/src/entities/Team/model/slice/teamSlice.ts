import { type TeamTableSchema } from '../types/teamTableSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTeamList } from '../services/fetchTeamList/fetchTeamList';
import { UserFromWs } from '../types/teamWebsocket';

const initialState: TeamTableSchema = {
  list: [],
  loading: false,
  error: null,
};

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeamLocalByOneUser: (state: TeamTableSchema, action: PayloadAction<UserFromWs>) => {
      state.list = state.list
        .map((teammate) => {
          if (Number(teammate.id) === Number(action.payload.id)) {
            return {
              ...teammate,
              ...action.payload
            }}
          return teammate;
        })
        .sort((a, b) => {
          if (a.status?.priority === b?.status?.priority) {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          return b.status?.priority - a.status?.priority;
        });
    },
    setTeamLocalByAllUsers: (state: TeamTableSchema, action: PayloadAction<UserFromWs[]>) => {
      state.list = state.list
        .map((teammate) => {
          const userFromWs = action.payload.find((user) => Number(user.id) === Number(teammate.id));
          if (userFromWs) {
            return {
              ...teammate,
              ...userFromWs
            }
          }
          return teammate;
        })
        .sort((a, b) => {
          if (a.status?.priority === b?.status?.priority) {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          return b.status?.priority - a.status?.priority;
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

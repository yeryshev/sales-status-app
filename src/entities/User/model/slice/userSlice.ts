import { checkUser, clearUser, updateUser } from '../actions/userActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserSchema } from '../types/User';

const userInitialState: UserSchema = {
  loading: false,
  error: null,
  mounted: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.mounted = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.data = undefined;
        state.error = action.error.message || 'Error';
        state.loading = false;
      })
      .addCase(clearUser.pending, (state) => {
        state.data = undefined;
      })
      .addCase(clearUser.fulfilled, (state) => {
        state.data = undefined;
      })
      .addCase(clearUser.rejected, (state, action) => {
        state.data = undefined;
        state.error = action.error.message || 'Error';
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = action.payload;
          state.error = null;
        }
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      });
  },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;

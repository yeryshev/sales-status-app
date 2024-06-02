import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileSchema } from '../types/profile';
import { fetchProfileData } from '../services/fetchProfileData/fetchProfileData';
import { updateProfileData } from '../services/updateProfileData/updateProfileData';
import { Profile } from '@/entities/Profile';

const initialState: ProfileSchema = {
  readonly: false,
  isLoading: false,
  error: undefined,
  data: undefined,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Profile>) => {
      state.form = {
        ...state.form,
        ...action.payload,
      };
    },
    cancelEdit: (state) => {
      state.form = state.data;
      state.validateErrors = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchProfileData.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.form = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileData.pending, (state) => {
        state.isLoading = true;
        state.validateErrors = undefined;
      })
      .addCase(updateProfileData.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.form = action.payload;
        state.validateErrors = undefined;
      })
      .addCase(updateProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.validateErrors = action.payload;
      });
  },
});

export const { actions: profileActions } = profileSlice;
export const { reducer: profileReducer } = profileSlice;

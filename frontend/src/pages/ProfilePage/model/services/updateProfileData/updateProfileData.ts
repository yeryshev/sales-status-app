import { ThunkConfig } from '@/app/providers/StoreProvider';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { getProfileForm } from '../../selectors/getProfileForm/getProfileForm';
import { validateProfileData } from '../validateProfileData/validateProfileData';
import { Profile } from '@/entities/Profile';
import { ValidateProfileError } from '../../consts/consts';

export const updateProfileData = createAsyncThunk<Profile, void, ThunkConfig<ValidateProfileError[]>>(
  'profile/updateProfileData',
  async (_, thunkAPI) => {
    const { extra, rejectWithValue, getState } = thunkAPI;
    const formData = getProfileForm(getState());

    const errors = validateProfileData(formData);

    if (errors.length) {
      return rejectWithValue(errors);
    }

    try {
      const response = await extra.api.patch<Profile>('/users/me', formData);

      if (!response.data) {
        throw new Error();
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue([ValidateProfileError.SERVER_ERROR]);
      }
      return rejectWithValue([ValidateProfileError.SERVER_ERROR]);
    }
  },
);

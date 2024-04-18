import { ProfileSchema, ValidateProfileError } from '../types/profile';
import { profileActions, profileReducer } from './profileSlice';
import { updateProfileData } from '../services/updateProfileData/updateProfileData';

const data = {
  firstName: 'firstName',
  secondName: 'secondName',
  email: 'example@example.com',
  photoUrl: 'photoUrl',
  extNumber: '2000',
  insideId: 1,
  telegram: 'telegram',
  isWorkingRemotely: true,
};

describe('profileSlice', () => {
  test('test cancelEdit', () => {
    const state: DeepPartial<ProfileSchema> = {
      data,
      form: { firstName: '123123' },
    };
    expect(profileReducer(state as ProfileSchema, profileActions.cancelEdit())).toEqual({
      validateErrors: undefined,
      error: undefined,
      data,
      form: data,
    });
  });

  test('test updateProfile', () => {
    const state: DeepPartial<ProfileSchema> = { form: { firstName: '11111' } };
    expect(profileReducer(state as ProfileSchema, profileActions.updateProfile({ firstName: '123123' }))).toEqual({
      form: { firstName: '123123' },
    });
  });

  test('test updateProfileData pending', () => {
    const state: DeepPartial<ProfileSchema> = {
      isLoading: false,
      validateErrors: [ValidateProfileError.SERVER_ERROR],
    };
    expect(profileReducer(state as ProfileSchema, updateProfileData.pending)).toEqual({
      isLoading: true,
      validateErrors: undefined,
    });
  });

  test('test updateProfileData fulfilled', () => {
    const state: DeepPartial<ProfileSchema> = {
      isLoading: true,
    };
    expect(profileReducer(state as ProfileSchema, updateProfileData.fulfilled(data, ''))).toEqual({
      isLoading: false,
      data,
      form: data,
      validateErrors: undefined,
    });
  });
});

import { StateSchema } from '@/app/providers/StoreProvider';
import { getProfileValidateErrors } from './getProfileValidateErrors';
import { describe, expect, test } from 'vitest';
import { ValidateProfileError } from '@/pages/ProfilePage/model/types/profile';

describe('getProfileValidateErrors', () => {
  test('should return profile validate errors', () => {
    const errors = [
      ValidateProfileError.INCORRECT_TELEGRAM,
      ValidateProfileError.INCORRECT_EXT_NUMBER,
      ValidateProfileError.NO_DATA,
      ValidateProfileError.SERVER_ERROR,
    ];

    const state: DeepPartial<StateSchema> = {
      profile: {
        validateErrors: errors,
      },
    };

    expect(getProfileValidateErrors(state as StateSchema)).toEqual(errors);
  });

  test('should work with empty state', () => {
    const state: DeepPartial<StateSchema> = {};
    expect(getProfileValidateErrors(state as StateSchema)).toEqual(undefined);
  });
});

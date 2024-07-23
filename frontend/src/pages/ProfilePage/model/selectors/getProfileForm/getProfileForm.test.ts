import { StateSchema } from '@/app/providers/StoreProvider';
import { getProfileForm } from './getProfileForm';
import { describe, expect, test } from 'vitest';

describe('getProfileForm', () => {
  test('should return profile form', () => {
    const data = {
      firstName: 'firstName',
      secondName: 'secondName',
      email: 'example@example.com',
      extNumber: 'extNumber',
      insideId: 1,
      telegram: 'telegram',
      isWorkingRemotely: true,
    };
    const state: DeepPartial<StateSchema> = {
      profile: {
        form: data,
      },
    };

    expect(getProfileForm(state as StateSchema)).toEqual(data);
  });

  test('should work with empty state', () => {
    const state: DeepPartial<StateSchema> = {};
    expect(getProfileForm(state as StateSchema)).toEqual(undefined);
  });
});

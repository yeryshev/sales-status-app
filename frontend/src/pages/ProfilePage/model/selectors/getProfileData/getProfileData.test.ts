import { StateSchema } from '@/app/providers/StoreProvider';
import { getProfileData } from './getProfileData';
import { describe, expect, test } from 'vitest';

describe('getProfileData', () => {
  test('should return profile data', () => {
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
      profile: { data },
    };

    expect(getProfileData(state as StateSchema)).toEqual(data);
  });

  test('should work with empty state', () => {
    const state: DeepPartial<StateSchema> = {};
    expect(getProfileData(state as StateSchema)).toEqual(undefined);
  });
});

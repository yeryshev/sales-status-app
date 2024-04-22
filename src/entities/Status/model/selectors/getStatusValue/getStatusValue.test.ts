import { StateSchema } from '@/app/providers/StoreProvider';
import { getStatusValue } from './getStatusValue';

describe('getStatusValue', () => {
  test('должно вернуть значение статуса', () => {
    const state: DeepPartial<StateSchema> = {
      status: {
        value: 1,
      },
    };
    expect(getStatusValue(state as StateSchema)).toBe(1);
  });
});

import { StateSchema } from '@/app/providers/StoreProvider';
import { getStatusValue } from './getStatusValue';

describe('getStatusValue', () => {
  test('должно вернуть значение статуса', () => {
    const state: DeepPartial<StateSchema> = {
      status: {
        value: {
          id: 1,
          title: 'занят',
          priority: 2,
          isDeadlineRequired: false,
        },
      },
    };
    expect(getStatusValue(state as StateSchema)).toEqual({
      id: 1,
      title: 'занят',
      priority: 2,
      isDeadlineRequired: false,
    });
  });
});

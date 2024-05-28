import { StateSchema } from '@/app/providers/StoreProvider';
import { getStatus } from './getStatus';

describe('getStatus', () => {
  test('должно вернуть весь стейт статуса', () => {
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
    expect(getStatus(state as StateSchema)).toEqual({
      value: {
        id: 1,
        title: 'занят',
        priority: 2,
        isDeadlineRequired: false,
      },
    });
  });
});

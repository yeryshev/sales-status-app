import { StateSchema } from '@/app/providers/StoreProvider';
import { getStatusData } from './getStatusData';

describe('getStatusValue', () => {
  test('должно вернуть значение статуса', () => {
    const state: DeepPartial<StateSchema> = {
      status: {
        data: {
          id: 1,
          title: 'занят',
          priority: 2,
          isDeadlineRequired: false,
        },
      },
    };
    expect(getStatusData(state as StateSchema)).toEqual({
      id: 1,
      title: 'занят',
      priority: 2,
      isDeadlineRequired: false,
    });
  });
});

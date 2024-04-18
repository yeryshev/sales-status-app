import { StateSchema } from '@/app/providers/StoreProvider';
import { getStatus } from './getStatus';

describe('getStatus', () => {
  test('должно вернуть весь стейт статуса', () => {
    const state: DeepPartial<StateSchema> = {
      status: {
        value: 1,
      },
    };
    expect(getStatus(state as StateSchema)).toEqual({ value: 1 });
  });
});

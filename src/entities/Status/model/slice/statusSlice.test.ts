import { StatusSchema, statusReducer } from '../..';
import { statusActions } from './statusSlice';

describe('statusSlice', () => {
  test('доолжно менять статус', () => {
    const state: StatusSchema = {
      value: {
        id: 1,
        title: 'занят',
        priority: 2,
        isDeadlineRequired: false,
      },
      loading: false,
      error: null,
    };

    expect(statusReducer(state, statusActions.changeStatus(3))).toEqual({
      value: 3,
      loading: false,
      error: null,
    });
  });

  test('должно работать с пустым стейтом', () => {
    expect(statusReducer(undefined, statusActions.changeStatus(3))).toEqual({
      value: 3,
      loading: false,
      error: null,
    });
  });
});

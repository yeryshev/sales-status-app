import { StatusSchema, statusReducer } from '../..';
import { statusActions } from './statusSlice';

describe('statusSlice', () => {
    test('доолжно менять статус', () => {
        const state: StatusSchema = { value: 1, loading: false, error: null };

        expect(statusReducer(state, statusActions.changeStatus(3))).toEqual({
            value: 3,
            loading: false,
            error: null
        });
    });

    test('ничего не делать, если статус меньше 1 или больше 3', () => {
        const state: StatusSchema = { value: 1, loading: false, error: null };

        expect(statusReducer(state, statusActions.changeStatus(5))).toEqual({
            value: 1,
            loading: false,
            error: null
        });
    });
    test('должно работать с пустым стейтом', () => {
        expect(statusReducer(undefined, statusActions.changeStatus(3))).toEqual({
            value: 3,
            loading: false,
            error: null
        });
    });
});

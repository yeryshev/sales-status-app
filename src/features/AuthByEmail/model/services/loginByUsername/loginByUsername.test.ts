import { describe, expect, test } from 'vitest';
import { loginByUsername } from './loginByUsername';
import { TestAsyncThunk } from '@/shared/lib/tests/TestAsyncThunk/TestAsyncThunk';

describe('loginByUsername', () => {
    test('test error', async () => {
        const thunk = new TestAsyncThunk(loginByUsername);
        thunk.api.mockReturnValue(Promise.resolve());
        const result = await thunk.callThunk({ username: 'test', password: 'test' });

        expect(thunk.dispatch).toHaveBeenCalledTimes(3);
        expect(thunk.api.post).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toBe('Что-то пошло не так');
    });
});
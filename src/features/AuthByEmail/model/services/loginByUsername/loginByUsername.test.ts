import axios from 'axios';
import { expect, vi, describe, test } from 'vitest';
import { loginByUsername } from './loginByUsername';
import { TestAsyncThunk } from '@/shared/lib/tests/TestAsyncThunk/TestAsyncThunk';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('loginByUsername', () => {
    test('test error', async () => {
        mockedAxios.post.mockReturnValue(Promise.resolve());
        const thunk = new TestAsyncThunk(loginByUsername);
        const result = await thunk.callThunk({ username: 'test', password: 'test' });

        expect(thunk.dispatch).toHaveBeenCalledTimes(3);
        expect(mockedAxios.post).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toBe('Что-то пошло не так');
    });
});
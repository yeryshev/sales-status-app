import { fetchProfileData } from './fetchProfileData';
import { TestAsyncThunk } from '@/shared/lib/tests/TestAsyncThunk/TestAsyncThunk';

const data = {
    firstName: 'firstName',
    secondName: 'secondName',
    email: 'example@example.com',
    photoUrl: 'photoUrl',
    extNumber: 'extNumber',
    insideId: 1,
    telegram: 'telegram',
    isWorkingRemotely: true,
};

describe('fetchProfileData', () => {
    test('success', async () => {
        const thunk = new TestAsyncThunk(fetchProfileData);
        // @ts-expect-error ts(2339)
        thunk.api.get.mockReturnValue(Promise.resolve({ data }));

        const result = await thunk.callThunk();

        expect(thunk.api.get).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('fulfilled');
        expect(result.payload).toEqual(data);
    });

    test('error login', async () => {
        const thunk = new TestAsyncThunk(fetchProfileData);
        // @ts-expect-error ts(2339)
        thunk.api.get.mockReturnValue(Promise.resolve({ status: 403 }));
        const result = await thunk.callThunk();

        expect(result.meta.requestStatus).toBe('rejected');
    });
});
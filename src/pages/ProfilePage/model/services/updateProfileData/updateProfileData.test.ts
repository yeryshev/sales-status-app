import { updateProfileData } from './updateProfileData';
import { TestAsyncThunk } from '@/shared/lib/tests/TestAsyncThunk/TestAsyncThunk';
import { ValidateProfileError } from '../../types/profile';

const data = {
    firstName: 'firstName',
    secondName: 'secondName',
    email: 'example@example.com',
    photoUrl: 'photoUrl',
    extNumber: '2000',
    insideId: 1,
    telegram: 'telegram',
    isWorkingRemotely: true,
};

describe('updateProfileData', () => {
    test('success', async () => {
        const thunk = new TestAsyncThunk(
            updateProfileData,
            {
                profile: {
                    form: data,
                },
            },
        );
        // @ts-expect-error ts(2339)
        thunk.api.patch.mockReturnValue(Promise.resolve({ data }));

        const result = await thunk.callThunk();

        expect(thunk.api.patch).toHaveBeenCalled();
        expect(result.meta.requestStatus).toBe('fulfilled');
        expect(result.payload).toEqual(data);
    });

    test('error update', async () => {
        const thunk = new TestAsyncThunk(
            updateProfileData,
            {
                profile: {
                    form: data,
                },
            },
        );
        // @ts-expect-error ts(2339)
        thunk.api.patch.mockReturnValue(Promise.resolve({ status: 403 }));
        const result = await thunk.callThunk();

        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toEqual([ValidateProfileError.SERVER_ERROR]);
    });

    test('validate error', async () => {
        const thunk = new TestAsyncThunk(
            updateProfileData,
            {
                profile: {
                    form: { ...data, telegram: '@username' },
                },
            },
        );
        const result = await thunk.callThunk();
        expect(result.meta.requestStatus).toBe('rejected');
        expect(result.payload).toEqual([ValidateProfileError.INCORRECT_TELEGRAM]);
    });
});
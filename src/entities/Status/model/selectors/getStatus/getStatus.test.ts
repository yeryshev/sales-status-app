import { RootState } from '@/app/providers/StoreProvider';
import { DeepPartial } from '@reduxjs/toolkit';
import { getStatus } from './getStatus';

describe('getStatus', () => {
    test('должно вернуть весь стейт статуса', () => {
        const state: DeepPartial<RootState> = {
            status: {
                value: 1,
            },
        };
        expect(getStatus(state as RootState)).toEqual({ value: 1 });
    });
});

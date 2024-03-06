import { RootState } from '@/app/providers/StoreProvider';
import { DeepPartial } from '@reduxjs/toolkit';
import { getStatusValue } from './getStatusValue';

describe('getStatusValue', () => {
    test('должно вернуть значение статуса', () => {
        const state: DeepPartial<RootState> = {
            status: {
                value: 1,
            },
        };
        expect(getStatusValue(state as RootState)).toBe(1);
    });
});

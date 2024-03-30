import { describe } from 'vitest';
import { validateProfileData } from './validateProfileData';
import { ValidateProfileError } from '@/pages/ProfilePage/model/types/profile';

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

describe('validateProfileData', () => {
    test('should return [] if profile data is valid', () => {
        const result = validateProfileData(data);
        expect(result).toEqual([]);
    });

    test('should return error if profile data is empty', () => {
        const result = validateProfileData();
        expect(result).toEqual([ValidateProfileError.NO_DATA]);
    });

    test('should return error if extNumber is invalid', () => {
        const result = validateProfileData({ ...data, extNumber: 'extNumber' });
        expect(result).toEqual([ValidateProfileError.INCORRECT_EXT_NUMBER]);
    });

    test('should return error if telegram login is invalid', () => {
        const result = validateProfileData({ ...data, telegram: '@username' });
        expect(result).toEqual([ValidateProfileError.INCORRECT_TELEGRAM]);
    });
});
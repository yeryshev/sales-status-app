import { Profile, ValidateProfileError } from '../../types/profile';

export const validateProfileData = (data?: Profile) => {
    if (!data) {
        return [ValidateProfileError.NO_DATA];
    }

    const { telegram } = data;
    const errors: ValidateProfileError[] = [];

    const telegramRegex = /^[a-zA-Z0-9._]+$/;
    if (telegram && !telegramRegex.test(telegram)) {
        errors.push(ValidateProfileError.INCORRECT_TELEGRAM);
    }

    return errors;
};
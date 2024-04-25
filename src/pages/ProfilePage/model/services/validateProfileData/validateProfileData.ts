import { ValidateProfileError } from '../../types/profile';
import { Profile } from '@/entities/Profile';

export const validateProfileData = (data?: Profile) => {
  if (!data) {
    return [ValidateProfileError.NO_DATA];
  }

  const { telegram, extNumber } = data;
  const errors: ValidateProfileError[] = [];

  const telegramRegex = /^[a-zA-Z0-9._]+$/;
  if (telegram && !telegramRegex.test(telegram)) {
    errors.push(ValidateProfileError.INCORRECT_TELEGRAM);
  }

  const onlyDigitsRegex: RegExp = /^\d+$/;
  if (extNumber && !onlyDigitsRegex.test(extNumber)) {
    errors.push(ValidateProfileError.INCORRECT_EXT_NUMBER);
  }

  return errors;
};

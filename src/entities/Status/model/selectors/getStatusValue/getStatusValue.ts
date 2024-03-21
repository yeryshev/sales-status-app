import { createSelector } from '@reduxjs/toolkit';
import { getStatus } from '../getStatus/getStatus';

export const getStatusValue = createSelector(getStatus, (status) => status.value);

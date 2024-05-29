import { createSelector } from '@reduxjs/toolkit';
import { getStatus } from '../getStatus/getStatus';

export const getStatusData = createSelector(getStatus, (status) => status.data);

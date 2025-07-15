import { StateSchema } from '@/app/providers/StoreProvider';
import { createSelector } from '@reduxjs/toolkit';
import { User } from '@/entities/User';

// Стабильная ссылка на пустой массив
const EMPTY_ARRAY: User[] = [];

export const getTeamList = createSelector(
  (state: StateSchema) => state.teamTable?.list,
  (list) => list || EMPTY_ARRAY,
);

export const getTeamIsLoading = (state: StateSchema) => state.teamTable?.loading || false;

export const getInboundTeamList = createSelector(getTeamList, (teamList) => {
  return teamList.filter((user) => !user.isAccountManager);
});

export const getAccountManagerTeamList = createSelector(getTeamList, (teamList) => {
  return teamList.filter((user) => user.isAccountManager);
});

export const getCustomerCareTeamList = createSelector(getTeamList, (teamList) => {
  return teamList.filter((user) => user.isCcManager);
});

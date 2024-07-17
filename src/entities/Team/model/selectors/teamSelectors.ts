import { StateSchema } from '@/app/providers/StoreProvider';
import { createSelector } from '@reduxjs/toolkit';

export const getTeamList = createSelector(
  (state: StateSchema) => state.teamTable?.list || [],
  (teamList) => teamList,
);
export const getTeamIsLoading = (state: StateSchema) => state.teamTable?.loading || false;

export const getInboundTeamList = createSelector(getTeamList, (teamList) => {
  return teamList.filter((user) => !user.isAccountManager);
});

export const getAccountManagerTeamList = createSelector(getTeamList, (teamList) => {
  return teamList.filter((user) => user.isAccountManager);
});

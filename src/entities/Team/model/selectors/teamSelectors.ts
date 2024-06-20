import { StateSchema } from '@/app/providers/StoreProvider';
import { createSelector } from '@reduxjs/toolkit';
import { getUserData } from '@/entities/User';

export const getTeamList = createSelector(
  (state: StateSchema) => state.teamTable?.list || [],
  (teamList) => teamList,
);
export const getTeamIsLoading = (state: StateSchema) => state.teamTable?.loading || false;

export const getTeammate = createSelector(getTeamList, getUserData, (teamList, userData) => {
  return teamList.find((t) => t.id === userData?.id && t.isManager);
});

export const getInboundTeamList = createSelector(getTeamList, (teamList) => {
  return teamList.filter((user) => !user.isAccountManager);
});

export const getAccountManagerTeamList = createSelector(getTeamList, (teamList) => {
  return teamList.filter((user) => user.isAccountManager);
});

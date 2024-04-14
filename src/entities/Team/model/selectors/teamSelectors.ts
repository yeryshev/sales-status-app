import { StateSchema } from '@/app/providers/StoreProvider';
import { createSelector } from '@reduxjs/toolkit';
import { getUserData } from '@/entities/User';

export const getTeamList = createSelector(
  (state: StateSchema) => state.teamTable?.list || [],
  (teamList) => teamList,
);
export const getTeamIsLoading = (state: StateSchema) => state.teamTable?.loading || false;

export const getTeammate = createSelector(getTeamList, getUserData, (teamList, userData) => {
  return teamList.find((t) => t.id === userData?.id && t.secondName && t.firstName);
});

export const getMangoStates = createSelector(
  (state: StateSchema) => state.teamTable?.mangoStates || {},
  (mangoStates) => mangoStates,
);

export const getTicketsStates = createSelector(
  (state: StateSchema) => state.teamTable?.ticketsStates || {},
  (ticketsStates) => ticketsStates,
);

export const getTasksStates = createSelector(
  (state: StateSchema) => state.teamTable?.tasksStates || {},
  (tasksStates) => tasksStates,
);

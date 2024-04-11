import { StateSchema } from '@/app/providers/StoreProvider';
import { createSelector } from '@reduxjs/toolkit';
import { getUserData } from '@/entities/User/model/selectors/userSelectors';

export const getTeamList = createSelector(
    (state: StateSchema) => state.teamTable?.list || [],
    (teamList) => teamList,
);
export const getTeamIsLoading = (state: StateSchema) => state.teamTable?.loading || false;

export const getTeamError = (state: StateSchema) => state.teamTable?.error;

export const getTeammate = createSelector(getTeamList, getUserData, (teamList, userData) => {
    return teamList.find((t) => t.id === userData?.id && t.secondName && t.firstName);
});

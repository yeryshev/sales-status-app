import { StateSchema } from '@/app/providers/StoreProvider';

export const getUserData = (state: StateSchema) => state.user.data;
export const getUserId = (state: StateSchema) => state.user.data?.id;
export const getUserMounted = (state: StateSchema) => state.user.mounted;
export const getUserIsLoading = (state: StateSchema) => state.user.loading;
export const getUserIsManager = (state: StateSchema) => state.user.data?.isManager || false;

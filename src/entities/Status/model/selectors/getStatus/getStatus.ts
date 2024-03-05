import { RootState } from '@/app/providers/StoreProvider';

export const getStatus = (state: RootState) => state.status;

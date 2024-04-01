import { StateSchema } from '@/app/providers/StoreProvider';

export const getUserComments = (state: StateSchema) => state.comments.list;
export const getAllComments = (state: StateSchema) => state.comments.fullList;
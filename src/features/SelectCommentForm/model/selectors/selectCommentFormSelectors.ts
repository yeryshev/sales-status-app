import { StateSchema } from '@/app/providers/StoreProvider';

export const getCommentItem = (state: StateSchema) => state.selectComment?.commentItem;
export const getCommentSelectValue = (state: StateSchema) => state.selectComment?.commentSelectValue || '';
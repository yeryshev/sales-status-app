import { StateSchema } from '@/app/providers/StoreProvider';

export const getCommentSelectItem = (state: StateSchema) => state.selectComment?.commentSelectItem;

import { StateSchema } from '@/app/providers/StoreProvider';

export const getStatusSelectItem = (state: StateSchema) => state.selectStatus?.statusSelectItem;

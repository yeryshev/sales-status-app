import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { StateSchema } from '@/app/providers/StoreProvider/config/StateSchema';

export const useAppSelector: TypedUseSelectorHook<StateSchema> = useSelector;

import { CommentsSchema } from '@/entities/Comment';
import { StatusSchema } from '@/entities/Status';
import { TeamTableSchema } from 'src/entities/Team';
import { UserSchema } from '@/entities/User';
import { LoginSchema } from '@/features/AuthByEmail';
import { CombinedState, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ProfileSchema } from '@/pages/ProfilePage';
import { AxiosInstance } from 'axios';
import { AddCommentFormSchema } from '@/features/AddCommentForm/model/types/addCommentForm';
import { SelectCommentFromSchema } from '@/features/SelectCommentForm/model/types/selectCommentForm';

export interface StateSchema {
  user: UserSchema;
  comments: CommentsSchema;
  status: StatusSchema;

  // Асинхронные редюсеры
  loginForm?: LoginSchema;
  profile?: ProfileSchema;
  addCommentForm?: AddCommentFormSchema;
  selectComment?: SelectCommentFromSchema;
  teamTable?: TeamTableSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (state: StateSchema, action: AnyAction) => CombinedState<StateSchema>;
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
  api: AxiosInstance;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: StateSchema;
}

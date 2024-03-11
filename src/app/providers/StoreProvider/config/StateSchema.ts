import { CommentsSchema } from '@/entities/Comment';
import { StatusSchema } from '@/entities/Status';
import { TeamState } from '@/entities/Teammate';
import { UserSchema } from '@/entities/User';
import { LoginSchema } from '@/features/AuthByEmail';
import { CombinedState, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ProfileSchema } from '@/entities/Profile';

export interface StateSchema {
    team: TeamState;
    user: UserSchema;
    comments: CommentsSchema;
    status: StatusSchema;

    // Асинхронные редюсеры
    loginForm?: LoginSchema;
    profile?: ProfileSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>
    reduce: (state: StateSchema, action: AnyAction) => CombinedState<StateSchema>
    add: (key: StateSchemaKey, reducer: Reducer) => void
    remove: (key: StateSchemaKey) => void
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}
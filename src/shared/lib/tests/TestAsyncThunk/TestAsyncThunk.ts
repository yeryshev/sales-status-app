import { StateSchema } from '@/app/providers/StoreProvider';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import axios, { AxiosStatic } from 'axios';
import { vi, MockedFunction } from 'vitest';

type ActionCreatorType<Return, Arg, RejectedValue>
  = (arg: Arg) => AsyncThunkAction<Return, Arg, { rejectValue: RejectedValue }>;

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

export class TestAsyncThunk<Return, Arg, RejectedValue> {
    dispatch: MockedFunction<() => Dispatch>;
    getState: () => StateSchema;
    actionCreator: ActionCreatorType<Return, Arg, RejectedValue>;
    api: MockedFunction<AxiosStatic>;
    navigate: MockedFunction<() => void>;

    constructor(actionCreator: ActionCreatorType<Return, Arg, RejectedValue>) {
        this.actionCreator = actionCreator;
        this.dispatch = vi.fn();
        this.getState = vi.fn();

        this.api = mockedAxios;
        this.navigate = vi.fn();
    }

    async callThunk(arg: Arg) {
        const action = this.actionCreator(arg);
        return action(
            this.dispatch,
            this.getState,
            { api: this.api, navigate: this.navigate },
        );
    }
}
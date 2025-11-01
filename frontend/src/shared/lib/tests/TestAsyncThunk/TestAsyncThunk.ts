import { StateSchema } from '@/app/providers/StoreProvider';
import { AsyncThunk } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import axios, { AxiosStatic } from 'axios';
import { vi, MockedFunction } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type ActionCreatorType<Return, Arg, _RejectedValue> = AsyncThunk<Return, Arg, any>;

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

export class TestAsyncThunk<Return, Arg, RejectedValue> {
  dispatch: MockedFunction<() => Dispatch>;
  getState: () => StateSchema;
  actionCreator: ActionCreatorType<Return, Arg, RejectedValue>;
  api: MockedFunction<AxiosStatic>;

  constructor(actionCreator: ActionCreatorType<Return, Arg, RejectedValue>, state?: DeepPartial<StateSchema>) {
    this.actionCreator = actionCreator;
    this.dispatch = vi.fn();
    this.getState = vi.fn(() => state as StateSchema);

    this.api = mockedAxios;
  }

  async callThunk(arg?: Arg) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action = this.actionCreator(arg as any);
    return action(this.dispatch, this.getState, { api: this.api });
  }
}

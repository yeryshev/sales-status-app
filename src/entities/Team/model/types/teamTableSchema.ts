import { type Teammate } from './teammate';
import { UsersMango, UsersTasks, UsersTickets } from './tasksWebsocket';

export interface TeamTableSchema {
  list: Teammate[];
  mangoStates: UsersMango;
  ticketsStates: UsersTickets;
  tasksStates: UsersTasks;
  loading: boolean;
  error: string | null;
}

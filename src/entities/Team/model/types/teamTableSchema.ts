import { type Teammate } from './teammate';
import { UsersMango, UsersTasks, UsersTickets, UsersVacation } from './tasksWebsocket';

export interface TeamTableSchema {
  list: Teammate[];
  mangoStates: UsersMango;
  ticketsStates: UsersTickets;
  tasksStates: UsersTasks;
  vacationStates: UsersVacation;
  loading: boolean;
  error: string | null;
}

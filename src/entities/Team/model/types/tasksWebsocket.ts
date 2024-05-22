import { Teammate } from '../../model/types/teammate';

export interface UserTasks {
  name: string;
  leads: number;
  tasks: number;
  conversations: number;
  deals: number;
  budget: number;
}

export type UserTickets = string | number;

export type UserVacation = {
  onVacation: boolean;
  endDate: string | null;
};

export type UserLastWeekStats = {
  deals: number;
  budget: number;
};

export type UsersMango = Record<Teammate['extNumber'], boolean>;
export type UsersTasks = Record<Teammate['insideId'], UserTasks>;
export type UsersTickets = Record<Teammate['insideId'], UserTickets>;
export type UsersVacation = Record<Teammate['insideId'], UserVacation>;
export type UsersLastWeekStats = Record<Teammate['insideId'], UserLastWeekStats>;

export enum WsTypes {
  MANGO = 'mango',
  TASKS = 'tasks',
  TICKETS = 'tickets',
  VACATION = 'vacation',
  LAST_WEEK_STATS = 'lastWeekStat',
}

export interface MangoWs {
  type: WsTypes.MANGO;
  data: UsersMango;
}

export interface TasksWs {
  type: WsTypes.TASKS;
  data: UsersTasks;
}

export interface TicketsWs {
  type: WsTypes.TICKETS;
  data: UsersTickets;
}

export interface VacationWs {
  type: WsTypes.VACATION;
  data: UsersVacation;
}

export type WsTasksData = MangoWs | TasksWs | TicketsWs | VacationWs;

export type TasksData = {
  [WsTypes.MANGO]: UsersMango;
  [WsTypes.TASKS]: UsersTasks;
  [WsTypes.TICKETS]: UsersTickets;
  [WsTypes.VACATION]: UsersVacation;
  [WsTypes.LAST_WEEK_STATS]: UsersLastWeekStats;
};

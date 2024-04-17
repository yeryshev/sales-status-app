import { Teammate } from '../../model/types/teammate';

export interface UserTasks {
  conversations: number;
  leads: number;
  name: string;
  tasks: number;
}

export type UserTickets = string | number;

export type UserVacation = {
  onVacation: boolean;
  endDate: string | null;
};

export type UsersMango = Record<Teammate['extNumber'], boolean>;
export type UsersTasks = Record<Teammate['insideId'], UserTasks>;
export type UsersTickets = Record<Teammate['insideId'], UserTickets>;
export type UsersVacation = Record<Teammate['insideId'], UserVacation>;

export enum WsTypes {
  MANGO = 'mango',
  TASKS = 'tasks',
  TICKETS = 'tickets',
  VACATION = 'vacation',
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

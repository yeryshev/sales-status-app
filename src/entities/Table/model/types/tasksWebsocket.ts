import { Teammate } from '@/entities/Teammate';

export type MangoRedisData = Record<string, boolean>

export interface UserTasks {
  conversations: number;
  leads: number;
  name: string;
  tasks: number;
}

export type UserTickets = string | number

export type UsersTasks = Record<Teammate['insideId'], UserTasks>
export type UsersTickets = Record<Teammate['insideId'], UserTickets>

export enum WsTypes {
  MANGO = 'mango',
  TASKS = 'tasks',
  TICKETS = 'tickets',
}

export interface MangoWs {
  type: WsTypes.MANGO;
  data: Record<string, boolean>;
}

export interface TasksWs {
  type: WsTypes.TASKS;
  data: UsersTasks;
}

export interface TicketsWs {
  type: WsTypes.TICKETS;
  data: UsersTickets;
}

export type WsTasksData = MangoWs | TasksWs | TicketsWs
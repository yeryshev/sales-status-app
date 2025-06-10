import { User } from '@/entities/User';

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
  description: string | null;
};

export type UserLastWeekStats = {
  deals: number;
  budget: number;
};

export type UserAvatarsAndBirthday = {
  avatar: string;
  isBirthday: boolean;
};

export type UsersMango = Record<User['extNumber'], boolean>;
export type UsersTasks = Record<User['insideId'], UserTasks>;
export type UsersTickets = Record<User['insideId'], UserTickets>;
export type UsersVacation = Record<User['insideId'], UserVacation>;
export type UsersLastWeekStats = Record<User['insideId'], UserLastWeekStats>;
export type UsersAvatarsAndBirthday = Record<User['insideId'], UserAvatarsAndBirthday>;

export enum WsTypes {
  MANGO = 'mango',
  MANGO_STATE = 'mangoState',
  TASKS = 'tasks',
  TICKETS = 'tickets',
  VACATION = 'vacation',
  LAST_WEEK_STATS = 'lastWeekStat',
  AVATARS_AND_BIRTHDAY = 'avatarsAndBirthday',
}

export interface MangoWs {
  type: WsTypes.MANGO;
  data: UsersMango;
}

export interface MangoStateWs {
  type: WsTypes.MANGO_STATE;
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

export type WsTasksData = MangoWs | MangoStateWs | TasksWs | TicketsWs | VacationWs;

export type TasksData = {
  [WsTypes.MANGO]: UsersMango;
  [WsTypes.TASKS]: UsersTasks;
  [WsTypes.TICKETS]: UsersTickets;
  [WsTypes.VACATION]: UsersVacation;
  [WsTypes.LAST_WEEK_STATS]: UsersLastWeekStats;
  [WsTypes.AVATARS_AND_BIRTHDAY]: UsersAvatarsAndBirthday;
};

export type UserFromWs = Pick<User, 'id' | 'statusId' | 'status' | 'busyTime' | 'updatedAt' | 'isWorkingRemotely'>;

export type UserWsUpdates = { user: UserFromWs } | { users: Array<UserFromWs> };

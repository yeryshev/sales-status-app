export interface UserTasks {
  conversations: number
  leads: number
  name: string
  tasks: number
}

export type UsersTasks = Record<number, UserTasks>

export interface TasksWs {
  type: 'tasks'
  data: UsersTasks
}

export type UserTickets = string | number

export type UsersTickets = Record<number, UserTickets>

export interface TicketsWs {
  type: 'tickets'
  data: UsersTickets
}

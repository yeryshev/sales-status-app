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

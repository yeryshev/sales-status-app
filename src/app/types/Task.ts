export interface Task {
  id: number
  userId: number
  uuid: string
  statusId: number
  commentId: number | null
  date: Date
}

import { type Comment } from '../../app/types/Comment'

export interface CommentsState {
  list: Comment[]
  fullList: Comment[]
  loading: boolean
  error: string | null
}

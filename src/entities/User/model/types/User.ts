import { Status } from '@/entities/Status';
import { TeammateComment } from '@/entities/Team/model/types/teammate';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  secondName: string;
  extNumber: string;
  insideId: number;
  telegram: string;
  isWorkingRemotely: boolean;
  isCoordinator: boolean;
  isFemale: boolean;
  isManager: boolean;
  statusId: number;
  commentId: number | null;
  status: Status;
  comment: TeammateComment;
  updatedAt: string;
}

export interface UserSchema {
  user?: User;
  loading: boolean;
  error: null | string;
  authData?: User;
  mounted: boolean;
}

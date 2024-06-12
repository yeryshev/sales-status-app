import { Status } from '@/entities/Status';
import { Comment } from '@/entities/Comment';

export interface Teammate {
  id: number;
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
  isAccountManager: boolean;
  status: Status;
  comment: Comment;
  updatedAt: string;
}

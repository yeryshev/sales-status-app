import { Status } from '@/entities/Status';

export interface TeammateComment {
  id: number;
  description: string;
}

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
  status: Status;
  comment: TeammateComment;
  updatedAt: string;
}

import { Status } from '@/entities/Status';

export interface BusyTime {
  id: number;
  statusId: number;
  userId: number;
  endTime: string;
}

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
  isAccountManager: boolean;
  statusId: number;
  isActive: boolean;
  isSuperuser: boolean;
  isVerified: boolean;
  status: Status;
  busyTime: BusyTime;
  updatedAt: string;
}

export interface UserSchema {
  data?: User;
  loading: boolean;
  error: null | string;

  mounted: boolean;
}

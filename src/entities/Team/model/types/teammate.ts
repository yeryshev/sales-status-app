export interface Teammate {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  extNumber: string;
  insideId: number;
  telegram: string;
  isWorkingRemotely: boolean;
  status: 'online' | 'busy' | 'offline';
  comment: string;
  updatedAt: string;
}

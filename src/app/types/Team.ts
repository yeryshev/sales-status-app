export type Teammate = {
  id: number;
  email: string;
  firstName: string;
  secondName: string;
  photoUrl: string;
  extNumber: string;
  telegram: string;
  isWorkingRemotely: boolean;
  status: 'online' | 'busy' | 'offline';
  comment: string;
  updatedAt: string;
};

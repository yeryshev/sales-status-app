export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  secondName: string;
  photoUrl: string;
  extNumber: string;
  telegram: string;
  isWorkingRemotely: boolean;
  statusId: number | null;
  commentId: number | null;
};

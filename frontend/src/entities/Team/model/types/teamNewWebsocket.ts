import { User } from '@/entities/User';

export type AdditionalUserData = {
  idAmoCRM: number;
  idInside: number;
  idChatwoot: number;
  budget: {
    newSale: number;
    newSaleAndUpsale: number;
  };
  deals: {
    newSale: number;
    newSaleAndUpsale: number;
  };
  overdueTasks: number;
  conversations: number;
  avatar: string;
  isBirthday: boolean;
  absence: {
    isAbsence: boolean;
    endDate: string | null;
    description: string | null;
  };
  tickets: number;
  mangoState: boolean;
  leads: number;
  lastWeek: {
    budget: number;
    deals: number;
  };
};

export type UserFromWs = Pick<User, 'id' | 'statusId' | 'status' | 'busyTime' | 'updatedAt' | 'isWorkingRemotely'>;

export type UserWsUpdates = { user: UserFromWs } | { users: Array<UserFromWs> };

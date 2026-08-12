import { User } from '@/entities/User';

export type AdditionalUserData = {
  idAmoCRM: number;
  idInside: number;
  idChatwoot: number;
  qlik?: {
    forecastWithK: string;
    factWithK: string;
  };
  budget: {
    newSale: number | null;
    newSaleAndUpsale: number | null;
  };
  deals: {
    newSale: number | null;
    newSaleAndUpsale: number | null;
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
  /** Deals without a lead source; null/undefined when metric is unavailable */
  leadsSourceLost?: number | null;
  lastWeek: {
    budget: number;
    deals: number;
  };
};

export type UserFromWs = Pick<User, 'id' | 'statusId' | 'status' | 'busyTime' | 'updatedAt' | 'isWorkingRemotely'>;

export type UserWsUpdates = { user: UserFromWs } | { users: Array<UserFromWs> };

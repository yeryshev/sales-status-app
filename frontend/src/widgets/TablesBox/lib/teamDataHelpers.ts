import { AdditionalUserData } from '@/entities/Team';

export const matchAdditionalUserData = (usersData: Array<AdditionalUserData>, insideId: number): AdditionalUserData => {
  return (
    usersData?.find((data) => data.idInside === insideId) ?? {
      idAmoCRM: 0,
      idInside: 0,
      idChatwoot: 0,
      budget: {
        newSale: null,
        newSaleAndUpsale: null,
      },
      deals: {
        newSale: null,
        newSaleAndUpsale: null,
      },
      overdueTasks: 0,
      conversations: 0,
      tickets: 0,
      avatar: '',
      isBirthday: false,
      absence: {
        isAbsence: false,
        endDate: null,
        description: null,
      },
      mangoState: false,
      leads: 0,
      leadsSourceLost: null,
      lastWeek: {
        budget: 0,
        deals: 0,
      },
    }
  );
};

export const hasLeadsSourceLost = (value: number | null | undefined): boolean => typeof value === 'number' && value > 0;

/** Show column only when at least one rendered table row has deals without source. */
export const shouldShowLeadsSourceLostColumn = (additionalDataList: AdditionalUserData[]): boolean =>
  additionalDataList.some((data) => hasLeadsSourceLost(data.leadsSourceLost));

export const createSkeletons = (count: number = 10) => new Array(count).fill(0).map((_, index) => index);

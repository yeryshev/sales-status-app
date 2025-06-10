import { AdditionalUserData } from '@/entities/Team';

export const matchAdditionalUserData = (usersData: Array<AdditionalUserData>, insideId: number): AdditionalUserData => {
  return (
    usersData?.find((data) => data.idInside === insideId) ?? {
      idAmoCRM: 0,
      idInside: 0,
      idChatwoot: 0,
      budget: {
        newSale: 0,
        newSaleAndUpsale: 0,
      },
      deals: {
        newSale: 0,
        newSaleAndUpsale: 0,
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
      lastWeek: {
        budget: 0,
        deals: 0,
      },
    }
  );
};

export const createSkeletons = (count: number = 10) => new Array(count).fill(0).map((_, index) => index);

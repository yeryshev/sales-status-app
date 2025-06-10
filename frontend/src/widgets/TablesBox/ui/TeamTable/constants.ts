export const DEFAULT_SKELETON_COUNT = 10;

export const EMPTY_ADDITIONAL_DATA = {
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
} as const;

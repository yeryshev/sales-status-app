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
  leadsSourceLost: null,
  lastWeek: {
    budget: 0,
    deals: 0,
  },
} as const;

export const CELL_WIDTHS = {
  AVATAR: 82,
  USER_NAME: 160,
  STATUS: 160,
  COMMENT: 300,
  QLIK: 120,
  AMO_CRM: 300,
  LEADS: 60,
  LEADS_SOURCE_LOST: 60,
  TASKS: 60,
  CONVERSATIONS: 60,
  TICKETS: 60,
  ARROW_DOWN: 72,
} as const;

import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { TeamResultsData, SortOrder } from './types';
import { MEDAL_MAPPER } from './constants';

export const createTeamResultsData = (
  id: number,
  avatar: string,
  name: string,
  deals: number,
  budget: number,
): TeamResultsData => ({
  id,
  avatar,
  name,
  deals,
  budget,
});

export const filterManagersOnly = (
  teammate: User,
  additionalTeamData: Array<AdditionalUserData>,
  isAccountManagersRoute: boolean = false,
): boolean => {
  const additionalUserData = additionalTeamData.find((data) => data.idInside === teammate.insideId);

  const deals = additionalUserData?.deals.newSale || 0;

  if (isAccountManagersRoute) {
    return teammate.isAccountManager && Number(deals) >= 0 && !teammate.isCoordinator;
  } else {
    return teammate.isManager && Number(deals) >= 0 && !teammate.isCoordinator;
  }
};

export const mapTeammateToResultsData = (
  teammate: User,
  additionalTeamData: Array<AdditionalUserData>,
  isCurrentWeek: boolean,
): TeamResultsData => {
  const additionalUserData = additionalTeamData.find((data) => data.idInside === teammate.insideId);

  const deals = isCurrentWeek
    ? Number(additionalUserData?.deals.newSale) || 0
    : Number(additionalUserData?.lastWeek.deals) || 0;

  const budget = isCurrentWeek
    ? Number(additionalUserData?.budget.newSaleAndUpsale) || 0
    : Number(additionalUserData?.lastWeek.budget) || 0;

  return createTeamResultsData(
    teammate.id,
    additionalUserData?.avatar || '',
    `${teammate.firstName} ${teammate.secondName}`,
    deals,
    budget,
  );
};

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T): number => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
};

export const getComparator = <Key extends keyof TeamResultsData>(
  order: SortOrder,
  orderBy: Key,
): ((a: TeamResultsData, b: TeamResultsData) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const calculateTopBudgetUsers = (rows: TeamResultsData[]): Record<number, string> => {
  return [...rows]
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 3)
    .reduce(
      (acc, teammate, index) => {
        acc[teammate.id] = MEDAL_MAPPER[index] || '';
        return acc;
      },
      {} as Record<number, string>,
    );
};

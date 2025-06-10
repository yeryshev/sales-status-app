import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';

export interface TeamResultsData {
  id: number;
  avatar: string;
  name: string;
  deals: number;
  budget: number;
}

export type SortOrder = 'asc' | 'desc';

export interface HeadCell {
  disablePadding: boolean;
  id: keyof TeamResultsData;
  label: string;
  numeric: boolean;
}

export interface TeamResultsTableProps {
  type: 'currentWeek' | 'lastWeek';
  teamList: User[];
  teamIsLoading: boolean;
  isAccountManagersRoute: boolean;
  additionalTeamData: Array<AdditionalUserData>;
}

export interface SortedTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TeamResultsData) => void;
  order: SortOrder;
  orderBy: string;
}

export interface TeamResultsRowProps {
  row: TeamResultsData;
  isCurrentWeek: boolean;
  topBudgetUsers: Record<number, string>;
  isSelected: boolean;
}

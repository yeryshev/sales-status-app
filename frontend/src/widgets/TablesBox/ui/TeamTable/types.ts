import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { TeamTableHeaderItemType } from './Headers/getTeamTableHeadersList';

export interface TeamTableProps {
  teamList: User[];
  teamIsLoading: boolean;
  isDeadlineReachedObject: Record<User['id'], boolean>;
  isAccountManagersRoute: boolean;
  additionalTeamData: Array<AdditionalUserData>;
}

export interface TeamMember {
  user: User;
  additionalData: AdditionalUserData;
  isDeadlineReached: boolean;
}

export interface TeamSectionProps {
  members: TeamMember[];
  isAccountManagersRoute: boolean;
  teamIsLoading: boolean;
  showLeadsSourceLost?: boolean;
}

export interface SeparatorRowProps {
  colSpan: number;
}

export interface FilteredTeamData {
  managers: TeamMember[];
  coordinators: TeamMember[];
  heroMember: TeamMember | null;
  headers: TeamTableHeaderItemType[];
  showLeadsSourceLost: boolean;
}

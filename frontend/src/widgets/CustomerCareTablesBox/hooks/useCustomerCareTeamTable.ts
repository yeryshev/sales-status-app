import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getUserData, getUserId, getUserIsManager } from '@/entities/User';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { TeamMember, createTeamMember, filterManagers, shouldShowHeroRow, createHeroMember } from '@/widgets/TablesBox';
import { getCustomerCareTableHeadersList } from '../ui/getCustomerCareTableHeadersList';

export interface CustomerCareTeamTableProps {
  teamList: User[];
  teamIsLoading: boolean;
  isDeadlineReachedObject: Record<User['id'], boolean>;
  additionalTeamData: Array<AdditionalUserData>;
}

export interface CustomerCareFilteredTeamData {
  managers: TeamMember[];
  coordinators: TeamMember[];
  heroMember: TeamMember | null;
  headers: ReturnType<typeof getCustomerCareTableHeadersList>;
}

export const useCustomerCareTeamTable = (props: CustomerCareTeamTableProps) => {
  const { teamList, isDeadlineReachedObject, additionalTeamData, teamIsLoading } = props;

  const userId = useSelector(getUserId);
  const user = useSelector(getUserData);
  const userIsManager = useSelector(getUserIsManager);

  // Для Customer Care показываем hero row если пользователь является CC менеджером
  const userOnRightPage = user?.isCcManager === true;
  const showHeroRow = shouldShowHeroRow(teamIsLoading, userIsManager, userOnRightPage);

  const teamMembers = useMemo(
    () => teamList.map((teammate) => createTeamMember(teammate, additionalTeamData, isDeadlineReachedObject)),
    [teamList, additionalTeamData, isDeadlineReachedObject],
  );

  const managers = useMemo(() => teamMembers.filter((member) => filterManagers(member, userId)), [teamMembers, userId]);

  const heroMember = useMemo(
    () => createHeroMember(user || null, additionalTeamData, isDeadlineReachedObject),
    [user, additionalTeamData, isDeadlineReachedObject],
  );

  const headers = useMemo(() => getCustomerCareTableHeadersList(showHeroRow), [showHeroRow]);

  const filteredData: CustomerCareFilteredTeamData = useMemo(
    () => ({
      managers,
      coordinators: [],
      heroMember: showHeroRow ? heroMember : null,
      headers,
    }),
    [managers, heroMember, showHeroRow, headers],
  );

  return {
    ...filteredData,
    hasCoordinators: false,
    hasManagers: managers.length > 0,
    teamListIsNotEmpty: teamList.length > 0,
  };
};

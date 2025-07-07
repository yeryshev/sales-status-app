import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getUserData, getUserId, getUserIsManager } from '@/entities/User';
import { TeamTableProps, FilteredTeamData } from '../types';
import { createTeamMember, filterManagers, filterCoordinators, shouldShowHeroRow, createHeroMember } from '../utils';
import { getTeamTableHeadersList } from '../Headers/getTeamTableHeadersList';

export const useTeamTable = (props: TeamTableProps) => {
  const { teamList, isDeadlineReachedObject, isAccountManagersRoute, additionalTeamData, teamIsLoading } = props;

  const userId = useSelector(getUserId);
  const user = useSelector(getUserData);
  const userIsManager = useSelector(getUserIsManager);

  const userOnRightPage = user?.isAccountManager === isAccountManagersRoute;
  const showHeroRow = shouldShowHeroRow(teamIsLoading, userIsManager, userOnRightPage);

  const teamMembers = useMemo(
    () => teamList.map((teammate) => createTeamMember(teammate, additionalTeamData, isDeadlineReachedObject)),
    [teamList, additionalTeamData, isDeadlineReachedObject],
  );

  const managers = useMemo(() => teamMembers.filter((member) => filterManagers(member, userId)), [teamMembers, userId]);

  const coordinators = useMemo(
    () => teamMembers.filter((member) => filterCoordinators(member, userId)),
    [teamMembers, userId],
  );

  const heroMember = useMemo(
    () => createHeroMember(user || null, additionalTeamData, isDeadlineReachedObject),
    [user, additionalTeamData, isDeadlineReachedObject],
  );

  const headers = useMemo(() => getTeamTableHeadersList(showHeroRow), [showHeroRow]);

  const filteredData: FilteredTeamData = useMemo(
    () => ({
      managers,
      coordinators,
      heroMember: showHeroRow ? heroMember : null,
      headers,
    }),
    [managers, coordinators, heroMember, showHeroRow, headers],
  );

  return {
    ...filteredData,
    hasCoordinators: coordinators.length > 0,
    hasManagers: managers.length > 0,
    teamListIsNotEmpty: teamList.length > 0,
  };
};

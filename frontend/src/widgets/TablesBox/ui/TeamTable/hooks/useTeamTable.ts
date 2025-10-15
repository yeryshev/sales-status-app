import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getUserData, getUserId } from '@/entities/User';
import { TeamTableProps, FilteredTeamData, TeamMember } from '../types';
import { createTeamMember, filterManagers, filterCoordinators, createHeroMember } from '../utils';
import { getTeamTableHeadersList } from '../Headers/getTeamTableHeadersList';

// Специальная функция фильтрации для Аккаунт менеджеров
const filterAccountManagers = (teamMember: TeamMember, excludeUserId?: number): boolean => {
  const { user } = teamMember;
  return user.isAccountManager && user.id !== excludeUserId && !user.isCoordinator;
};

export const useTeamTable = (props: TeamTableProps) => {
  const { teamList, isDeadlineReachedObject, isAccountManagersRoute, additionalTeamData, teamIsLoading } = props;

  const userId = useSelector(getUserId);
  const user = useSelector(getUserData);

  // Показываем hero row если пользователь имеет соответствующие права и не является суперпользователем
  const userOnRightPage = isAccountManagersRoute
    ? user?.isAccountManager === true && user?.isSuperuser === false
    : user?.isManager === true && user?.isSuperuser === false;
  const showHeroRow = !teamIsLoading && userOnRightPage;

  const teamMembers = useMemo(
    () => teamList.map((teammate) => createTeamMember(teammate, additionalTeamData, isDeadlineReachedObject)),
    [teamList, additionalTeamData, isDeadlineReachedObject],
  );

  // Используем разные функции фильтрации в зависимости от маршрута
  const managers = useMemo(() => {
    if (isAccountManagersRoute) {
      return teamMembers.filter((member) => filterAccountManagers(member, userId));
    } else {
      return teamMembers.filter((member) => filterManagers(member, userId));
    }
  }, [teamMembers, userId, isAccountManagersRoute]);

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

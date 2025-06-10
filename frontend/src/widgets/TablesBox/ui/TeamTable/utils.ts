import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { TeamMember } from './types';

import { matchAdditionalUserData } from '../../lib/teamDataHelpers';

export const createTeamMember = (
  user: User,
  additionalTeamData: Array<AdditionalUserData>,
  isDeadlineReachedObject: Record<User['id'], boolean>,
): TeamMember => ({
  user,
  additionalData: matchAdditionalUserData(additionalTeamData, user.insideId),
  isDeadlineReached: isDeadlineReachedObject[user.id] || false,
});

export const filterManagers = (teamMember: TeamMember, excludeUserId?: number): boolean => {
  const { user } = teamMember;
  return user.isManager && user.id !== excludeUserId && !user.isCoordinator;
};

export const filterCoordinators = (teamMember: TeamMember, excludeUserId?: number): boolean => {
  const { user } = teamMember;
  return user.isCoordinator && user.id !== excludeUserId;
};

export const shouldShowHeroRow = (
  teamIsLoading: boolean,
  userIsManager: boolean,
  userOnRightPage: boolean,
): boolean => {
  return !teamIsLoading && userIsManager && userOnRightPage;
};

export const createHeroMember = (
  user: User | null,
  additionalTeamData: Array<AdditionalUserData>,
  isDeadlineReachedObject: Record<User['id'], boolean>,
): TeamMember | null => {
  if (!user) return null;

  return {
    user,
    additionalData: matchAdditionalUserData(additionalTeamData, user.insideId),
    isDeadlineReached: isDeadlineReachedObject[user.id] || false,
  };
};

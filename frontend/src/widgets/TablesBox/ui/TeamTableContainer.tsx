import { memo } from 'react';
import { TeamTableTabPanel } from '@/features/TeamTableTabs';
import { TeamTable } from './TeamTable/TeamTable';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';

interface TeamTableContainerProps {
  active: boolean;
  teamList: User[];
  teamIsLoading: boolean;
  additionalTeamData: Array<AdditionalUserData>;
  deadlines: Record<User['id'], boolean>;
  isAccountManagersRoute: boolean;
}

export const TeamTableContainer = memo((props: TeamTableContainerProps) => {
  const { active, teamList, teamIsLoading, additionalTeamData, deadlines, isAccountManagersRoute } = props;

  if (!active) {
    return null;
  }

  return (
    <TeamTableTabPanel value={0} index={0}>
      <TeamTable
        teamList={teamList}
        teamIsLoading={teamIsLoading}
        additionalTeamData={additionalTeamData}
        isDeadlineReachedObject={deadlines}
        isAccountManagersRoute={isAccountManagersRoute}
      />
    </TeamTableTabPanel>
  );
});

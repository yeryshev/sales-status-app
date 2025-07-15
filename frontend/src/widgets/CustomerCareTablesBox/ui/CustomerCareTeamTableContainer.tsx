import { memo } from 'react';
import { TeamTableTabPanel } from '@/features/TeamTableTabs';
import { CustomerCareTeamTable } from './CustomerCareTeamTable';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';

interface CustomerCareTeamTableContainerProps {
  active: boolean;
  teamList: User[];
  teamIsLoading: boolean;
  additionalTeamData: Array<AdditionalUserData>;
  deadlines: Record<User['id'], boolean>;
}

export const CustomerCareTeamTableContainer = memo((props: CustomerCareTeamTableContainerProps) => {
  const { active, teamList, teamIsLoading, additionalTeamData, deadlines } = props;

  if (!active) {
    return null;
  }

  return (
    <TeamTableTabPanel value={0} index={0}>
      <CustomerCareTeamTable
        teamList={teamList}
        teamIsLoading={teamIsLoading}
        additionalTeamData={additionalTeamData}
        isDeadlineReachedObject={deadlines}
      />
    </TeamTableTabPanel>
  );
});

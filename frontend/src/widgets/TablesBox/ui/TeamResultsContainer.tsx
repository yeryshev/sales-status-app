import { memo } from 'react';
import Box from '@mui/material/Box';
import { TeamTableTabPanel } from '@/features/TeamTableTabs';
import { TeamResultsTable } from './TeamResults/TeamResultsTable';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';

interface TeamResultsContainerProps {
  active: boolean;
  teamList: User[];
  teamIsLoading: boolean;
  additionalTeamData: Array<AdditionalUserData>;
  isAccountManagersRoute: boolean;
}

export const TeamResultsContainer = memo((props: TeamResultsContainerProps) => {
  const { active, teamList, teamIsLoading, additionalTeamData, isAccountManagersRoute } = props;

  if (!active) {
    return null;
  }

  return (
    <TeamTableTabPanel value={1} index={1}>
      <Box display={'flex'} gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
        <TeamResultsTable
          type="currentWeek"
          teamList={teamList}
          teamIsLoading={teamIsLoading}
          additionalTeamData={additionalTeamData}
          isAccountManagersRoute={isAccountManagersRoute}
        />
        <TeamResultsTable
          type="lastWeek"
          teamList={teamList}
          teamIsLoading={teamIsLoading}
          additionalTeamData={additionalTeamData}
          isAccountManagersRoute={isAccountManagersRoute}
        />
      </Box>
    </TeamTableTabPanel>
  );
});

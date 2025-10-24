import { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { HorseRaceTrack } from './HorseRaceTrack';

interface CompetitionContainerProps {
  active: boolean;
  teamList: User[];
  teamIsLoading: boolean;
  additionalTeamData: AdditionalUserData[];
  isAccountManagersRoute?: boolean;
}

export const CompetitionContainer = memo((props: CompetitionContainerProps) => {
  const { active, teamList, teamIsLoading, additionalTeamData, isAccountManagersRoute } = props;

  if (!active) {
    return null;
  }

  if (teamIsLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Загрузка данных...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
        🏇 Скачки
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        Позиция каждого участника зависит от текущей фактической выручки
      </Typography>

      <HorseRaceTrack
        teamList={teamList}
        additionalTeamData={additionalTeamData}
        isAccountManagersRoute={isAccountManagersRoute}
      />
    </Box>
  );
});

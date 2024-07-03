import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import PhoneIcon from '@mui/icons-material/Phone';
import Typography from '@mui/material/Typography';
import { feminizeWord } from '@/shared/lib/feminizeWords/feminizeWords';
import { Teammate } from '@/entities/Team';
import { UserVacation } from '@/entities/Team/model/types/tasksWebsocket';
import moment from 'moment/moment';
import { Status } from '@/entities/Status';
import { OverridableStringUnion } from '@mui/types';

const mapStatusColors = (
  status_priority: Status['priority'],
): OverridableStringUnion<'default' | 'success' | 'primary', 'default' | 'success' | 'primary'> => {
  if (status_priority === 0) {
    return 'default';
  }
  if (status_priority === 2) {
    return 'success';
  }
  return 'primary';
};

interface StatusCellProps {
  teammate: Teammate;
  mango: boolean;
  vacationState?: UserVacation;
  isDeadlineReached: boolean;
}

export const StatusCell = memo((props: StatusCellProps) => {
  const { teammate, mango, vacationState, isDeadlineReached } = props;
  const teammateStatus = teammate.status;

  const deadline = teammate?.busyTime?.endTime;
  const updateTimeMsk = moment.utc(teammate.updatedAt).utcOffset('+0300').format('HH:mm');
  const deadlineTimeMsk = moment.utc(deadline).utcOffset('+0300').format('HH:mm');

  return (
    <Tooltip disableFocusListener title={`Последнее обновление в ${updateTimeMsk}`}>
      <Box display={'flex'} alignItems={'start'} justifyContent={'start'} gap={0.5} flexDirection={'column'}>
        <Chip
          label={
            mango ? (
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={0.5}>
                <PhoneIcon fontSize={'small'} />
                <Typography variant={'body2'}>на звонке</Typography>
              </Box>
            ) : vacationState?.onVacation ? (
              <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={0.5}>
                <Typography variant={'body2'} display={'flex'} alignItems={'center'} fontSize={'small'}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 9c1.59 7.61-2 13-2 13h3c1.88-5.8 1-9.91.5-12m2.16-2.84c.17.21.34.43.47.66a7.1 7.1 0 0 1-.63 8.44a7.11 7.11 0 0 0-.55-6.49c-.08-.13-.17-.24-.25-.36a7.1 7.1 0 0 0-2.16-1.98a7.13 7.13 0 0 0-4.96 6.79c0 .74.11 1.45.31 2.11a7.07 7.07 0 0 1-1.33-4.14c0-2.35 1.14-4.43 2.89-5.73C8 6.35 6.46 6.67 5.12 7.5q-.93.615-1.62 1.41C4.05 7.58 5 6.39 6.3 5.57c1.5-.94 3.2-1.25 4.84-1.01C10.73 4 10.23 3.47 9.63 3c-.58-.42-1.21-.76-1.87-1c1.44.04 2.88.5 4.11 1.43c.63.47 1.13 1.04 1.53 1.64c.1 0 .19-.01.29-.01c3.2 0 5.91 2.11 6.81 5.02a7.07 7.07 0 0 0-4.84-2.92"
                    ></path>
                  </svg>
                </Typography>
                <Typography variant={'body2'}>в отпуске</Typography>
              </Box>
            ) : (
              <Typography variant={'body2'}>{feminizeWord(teammate.status?.title, teammate.isFemale)}</Typography>
            )
          }
          color={mapStatusColors(teammate.status?.priority)}
          size={'small'}
        />
        {teammateStatus?.isDeadlineRequired && (
          <Typography variant="caption" color={`${isDeadlineReached ? 'error' : 'text.secondary'}`}>
            ≈ до {deadlineTimeMsk}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
});

import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import PhoneIcon from '@mui/icons-material/Phone';
import Typography from '@mui/material/Typography';
import { feminizeWord } from '@/shared/lib/feminizeWords/feminizeWords';
import { AdditionalUserData, Teammate } from '@/entities/Team';
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
  mango: AdditionalUserData['mangoState'];
  absence: AdditionalUserData['absence'];
  isDeadlineReached: boolean;
}

export const StatusCell = memo((props: StatusCellProps) => {
  const { teammate, mango, absence, isDeadlineReached } = props;
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
            ) : absence?.isAbsence ? (
              <Typography variant={'body2'}>{absence?.description?.toLowerCase() || 'в отпуске'}</Typography>
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

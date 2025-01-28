import { memo } from 'react';
import { Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { Teammate } from '@/entities/Team';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/User';

interface CommentCellProps {
  teammate: Teammate;
  teamIsLoading: boolean;
  isDeadlineReached: boolean;
}

export const CommentCell = memo((props: CommentCellProps) => {
  const { teammate, teamIsLoading, isDeadlineReached } = props;
  const user = useSelector(getUserData);
  const userStatus = user?.status;
  const deadline = teammate?.busyTime?.endTime;
  const deadlineTimeMsk = moment.utc(deadline).utcOffset('+0300').format('HH:mm');

  return teamIsLoading ? (
    <Skeleton variant="text" />
  ) : (
    userStatus?.isDeadlineRequired && (
      <Typography
        variant="body2"
        color={`${isDeadlineReached ? 'error' : 'text.secondary'}`}
        sx={{ opacity: isDeadlineReached ? 1 : 0.5 }}
      >
        до {deadlineTimeMsk}
      </Typography>
    )
  );
});

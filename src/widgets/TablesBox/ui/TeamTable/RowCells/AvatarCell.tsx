import { memo } from 'react';
import { Teammate } from '@/entities/Team';
import { Avatar } from '@mui/material';
import { UserAvatarsAndBirthday, UserVacation } from '@/entities/Team/model/types/tasksWebsocket';

interface AvatarCellProps {
  teammate: Teammate;
  avatarsAndBirthday: UserAvatarsAndBirthday;
  vacationState?: UserVacation;
}

export const AvatarCell = memo((props: AvatarCellProps) => {
  const { teammate, avatarsAndBirthday, vacationState } = props;

  return (
    <Avatar
      alt={`${teammate.firstName} ${teammate.secondName}`}
      src={avatarsAndBirthday?.avatar}
      sx={{ width: 50, height: 50, filter: vacationState?.onVacation ? 'grayscale(100%)' : 'none' }}
    />
  );
});

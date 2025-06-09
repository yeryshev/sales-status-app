import { memo } from 'react';
import { AdditionalUserData, Teammate } from '@/entities/Team';
import { Avatar } from '@mui/material';

interface AvatarCellProps {
  teammate: Teammate;
  avatar: AdditionalUserData['avatar'];
  absence?: AdditionalUserData['absence'];
}

export const AvatarCell = memo((props: AvatarCellProps) => {
  const { teammate, avatar, absence } = props;

  return (
    <Avatar
      alt={`${teammate.firstName} ${teammate.secondName}`}
      src={avatar}
      sx={{ width: 50, height: 50, filter: absence?.isAbsence ? 'grayscale(100%)' : 'none' }}
    />
  );
});

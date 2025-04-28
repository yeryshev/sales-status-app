import { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Tooltip } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { AdditionalUserData, Teammate } from '@/entities/Team';

interface UserNameCellProps {
  teammate: Teammate;
  absence?: AdditionalUserData['absence'];
}

export const UserNameCell = memo((props: UserNameCellProps) => {
  const { teammate, absence } = props;

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={0.5}>
      {absence?.isAbsence ? (
        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            variant={'body2'}
            color={'text.secondary'}
            sx={{ opacity: 0.5 }}
          >{`${teammate.firstName}`}</Typography>
          <Typography
            variant={'body2'}
            color={'text.secondary'}
            sx={{ opacity: 0.5 }}
          >{` ${teammate.secondName}`}</Typography>
        </Box>
      ) : (
        <Box display={'flex'} flexDirection={'column'}>
          <Typography variant={'body2'}>{`${teammate.firstName}`}</Typography>
          <Typography variant={'body2'}>{` ${teammate.secondName}`}</Typography>
        </Box>
      )}
      {teammate.isWorkingRemotely && !absence?.isAbsence && (
        <Tooltip title={'Работаю из дома'}>
          <HomeOutlinedIcon fontSize={'small'} />
        </Tooltip>
      )}
    </Box>
  );
});

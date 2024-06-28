import { type ChangeEvent, memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Avatar, Chip, Skeleton, Switch, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { Teammate } from '@/entities/Team/model/types/teammate';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { UserAvatarsAndBirthday, UserTasks, UserTickets } from '@/entities/Team/model/types/tasksWebsocket';
import { StatusSelector } from '@/features/Status/StatusSelector/ui/StatusSelector';
import { getUserData } from '@/entities/User';
import Typography from '@mui/material/Typography';
import moment from 'moment/moment';

interface UserRowProps {
  teammate: Teammate;
  tasks: UserTasks;
  tickets: UserTickets;
  avatarsAndBirthday: UserAvatarsAndBirthday;
  teamIsLoading: boolean;
  isDeadlineReached: boolean;
}

export const HeroRow = memo((props: UserRowProps) => {
  const { teammate, tasks, tickets, teamIsLoading, avatarsAndBirthday, isDeadlineReached } = props;
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();
  const userStatus = user?.status;
  const deadline = teammate?.busyTime?.endTime;
  const deadlineTimeMsk = moment.utc(deadline).utcOffset('+0300').format('HH:mm');

  const handleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    user && dispatch(updateUser({ user: { ...user, isWorkingRemotely: e.target.checked } }));
  };

  return (
    <TableRow key={teammate.id} hover={false}>
      <TableCell align="left" width={50}>
        {teamIsLoading ? (
          <Skeleton variant="circular" width={50} height={50} />
        ) : (
          <Avatar
            alt={`${teammate.firstName} ${teammate.secondName}`}
            src={avatarsAndBirthday?.avatar}
            sx={{ width: 50, height: 50 }}
          />
        )}
      </TableCell>
      <TableCell align="left" width={160}>
        {teamIsLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={0.5}>
            <Box display={'flex'} flexDirection={'column'}>
              <Typography variant={'body2'}>{`${teammate.firstName}`}</Typography>
              <Typography variant={'body2'}>{` ${teammate.secondName}`}</Typography>
            </Box>
            {teammate.isWorkingRemotely && (
              <Tooltip title={'Работаю из дома'}>
                <HomeOutlinedIcon fontSize={'small'} />
              </Tooltip>
            )}
          </Box>
        )}
      </TableCell>
      <TableCell align="left" sx={{ width: '160px' }}>
        {teamIsLoading ? <Skeleton variant="text" /> : <StatusSelector />}
      </TableCell>
      <TableCell align="left">
        {teamIsLoading ? (
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
        )}
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        {!teamIsLoading && tasks && Boolean(tasks.leads) && (
          <Tooltip title={'Первичные обращения'}>
            <Chip
              label={tasks.leads}
              variant={'outlined'}
              size={'small'}
              color={tasks.leads >= 5 ? 'error' : tasks.leads === 0 ? 'success' : 'primary'}
            ></Chip>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        {!teamIsLoading && tasks && Boolean(tasks.tasks) && (
          <Tooltip title={'Просроченные задачи'}>
            <Chip
              label={tasks.tasks}
              variant={'outlined'}
              size={'small'}
              color={tasks.tasks >= 5 ? 'error' : tasks.tasks === 0 ? 'success' : 'primary'}
            ></Chip>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        {!teamIsLoading && tasks && Boolean(tasks.conversations) && (
          <Tooltip title={'Количество открытых чатов'}>
            <Chip
              label={tasks.conversations}
              variant={'outlined'}
              size={'small'}
              color={tasks.conversations === 0 ? 'success' : 'primary'}
            ></Chip>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        {!teamIsLoading && Boolean(tickets) && (
          <Tooltip title={'Назначенные тикеты'}>
            <Chip
              label={tickets}
              variant={'outlined'}
              size={'small'}
              color={Number(tickets) >= 3 ? 'error' : Number(tickets) === 0 ? 'success' : 'primary'}
            ></Chip>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="center" sx={{ width: '50px' }}>
        <Switch name="isWorkingRemotely" checked={teammate.isWorkingRemotely} size={'small'} onChange={handleSwitch} />
      </TableCell>
    </TableRow>
  );
});

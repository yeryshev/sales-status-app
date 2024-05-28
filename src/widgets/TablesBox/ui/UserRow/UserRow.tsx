import moment from 'moment';
import { type ChangeEvent, memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Avatar, Chip, Skeleton, Switch, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { Teammate } from '@/entities/Team/model/types/teammate';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { UserAvatarsAndBirthday, UserTasks, UserTickets } from '@/entities/Team/model/types/tasksWebsocket';
import { Status } from '@/entities/Status';

const mapStatusColors = (status_priority: Status['priority']) => {
  if (status_priority === 0) {
    return 'default';
  }
  if (status_priority === 2) {
    return 'success';
  }
  return 'primary';
};

interface UserRowProps {
  teammate: Teammate;
  mango: boolean;
  tasks: UserTasks;
  tickets: UserTickets;
  avatarsAndBirthday: UserAvatarsAndBirthday;
  teamIsLoading: boolean;
}

export const UserRow = memo((props: UserRowProps) => {
  const { teammate, mango, tasks, tickets, teamIsLoading, avatarsAndBirthday } = props;
  const user = useSelector((state: StateSchema) => state.user.user);
  const dispatch = useAppDispatch();
  const updateTimeMsk = moment.utc(teammate.updatedAt).utcOffset('+0300').format('HH:mm');

  const handleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    user && dispatch(updateUser({ ...user, isWorkingRemotely: e.target.checked }));
  };

  return (
    <TableRow key={teammate.id} hover={false}>
      <TableCell align="left" sx={{ width: '50px' }}>
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
      <TableCell align="left" sx={{ width: '180px' }}>
        {teamIsLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Box display={'flex'} alignItems={'center'} gap={1}>
            {teammate.firstName} {teammate.secondName}{' '}
            {teammate.isWorkingRemotely && (
              <Tooltip title={'Работаю из дома'}>
                <HomeOutlinedIcon fontSize={'small'} />
              </Tooltip>
            )}
          </Box>
        )}
      </TableCell>
      <TableCell align="left" sx={{ width: '110px' }}>
        {teamIsLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Tooltip disableFocusListener title={`Последнее обновление в ${updateTimeMsk}`}>
            <Chip
              label={
                mango ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <PhoneIcon fontSize={'small'} /> на звонке
                  </div>
                ) : (
                  teammate.status.title
                )
              }
              color={mapStatusColors(teammate.status?.priority)}
              size={'small'}
            />
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="left">{teamIsLoading ? <Skeleton variant="text" /> : teammate.comment?.description}</TableCell>
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

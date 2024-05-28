import moment from 'moment';
import { memo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import { Avatar, Chip, Link, Tooltip } from '@mui/material';
import { Teammate } from '@/entities/Team/model/types/teammate';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import {
  UserAvatarsAndBirthday,
  UserTasks,
  UserTickets,
  UserVacation,
} from '@/entities/Team/model/types/tasksWebsocket';
import Typography from '@mui/material/Typography';
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

interface TeamRowProps {
  teammate: Teammate;
  mango: boolean;
  tasks: UserTasks;
  tickets: UserTickets;
  vacationState: UserVacation | undefined;
  avatarsAndBirthday: UserAvatarsAndBirthday;
  teamIsLoading: boolean;
}

const renderVacationDay = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const formatter = new Intl.DateTimeFormat('ru', options);
  return formatter.format(date);
};

const renderStateLabel = (label: string | number, onVacation: boolean = false) => {
  return onVacation ? (
    <Typography color={'text.secondary'} sx={{ opacity: 0.5 }} variant={'body2'}>
      {String(label)}
    </Typography>
  ) : (
    <Typography variant={'body2'}>{String(label)}</Typography>
  );
};

export const TeamRow = memo((props: TeamRowProps) => {
  const { teammate, mango, tasks, tickets, vacationState, teamIsLoading, avatarsAndBirthday } = props;
  const [expandRow, setExpandRow] = useState(false);
  const updateTimeMsk = moment.utc(teammate.updatedAt).utcOffset('+0300').format('HH:mm');

  return (
    <>
      <TableRow key={teammate.id} hover={true}>
        <TableCell align="left" width={50}>
          <Avatar
            alt={`${teammate.firstName} ${teammate.secondName}`}
            src={avatarsAndBirthday?.avatar}
            sx={{ width: 50, height: 50, filter: vacationState?.onVacation ? 'grayscale(100%)' : 'none' }}
          />
        </TableCell>
        <TableCell align="left" sx={{ width: '180px' }}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={0.5}>
            {vacationState?.onVacation ? (
              <Typography
                variant={'body2'}
                color={'text.secondary'}
                sx={{ opacity: 0.5 }}
              >{`${teammate.firstName} ${teammate.secondName}`}</Typography>
            ) : (
              <Typography variant={'body2'}>{`${teammate.firstName} ${teammate.secondName}`}</Typography>
            )}
            {teammate.isWorkingRemotely && !vacationState?.onVacation && (
              <Tooltip title={'Работаю из дома'}>
                <HomeOutlinedIcon fontSize={'small'} />
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell align="left" sx={{ width: '140px' }}>
          <Tooltip disableFocusListener title={`Последнее обновление в ${updateTimeMsk}`}>
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
                  <Typography variant={'body2'}>{teammate.status?.title}</Typography>
                )
              }
              color={mapStatusColors(teammate.status.priority)}
              size={'small'}
            />
          </Tooltip>
        </TableCell>
        <TableCell align="left">
          {vacationState?.endDate ? (
            <Typography color={'text.secondary'} sx={{ opacity: 0.5 }} variant={'body2'}>
              до {renderVacationDay(vacationState?.endDate)}
            </Typography>
          ) : (
            teammate.comment?.description
          )}
        </TableCell>
        <TableCell align="center" sx={{ width: '60px' }}>
          {!teamIsLoading && tasks && Boolean(tasks.leads) && (
            <Tooltip title={'Первичные обращения'}>
              <Chip
                label={renderStateLabel(tasks.leads, vacationState?.onVacation)}
                variant={'outlined'}
                size={'small'}
                color={
                  vacationState?.onVacation
                    ? 'default'
                    : tasks.leads >= 5
                      ? 'error'
                      : tasks.leads === 0
                        ? 'success'
                        : 'primary'
                }
              ></Chip>
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="center" sx={{ width: '60px' }}>
          {!teamIsLoading && tasks && Boolean(tasks.tasks) && (
            <Tooltip title={'Просроченные задачи'}>
              <Chip
                label={renderStateLabel(tasks.tasks, vacationState?.onVacation)}
                variant={'outlined'}
                size={'small'}
                color={
                  vacationState?.onVacation
                    ? 'default'
                    : tasks.tasks >= 5
                      ? 'error'
                      : tasks.tasks === 0
                        ? 'success'
                        : 'primary'
                }
              ></Chip>
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="center" sx={{ width: '60px' }}>
          {!teamIsLoading && tasks && Boolean(tasks.conversations) && (
            <Tooltip title={'Количество открытых чатов'}>
              <Chip
                label={renderStateLabel(tasks.conversations, vacationState?.onVacation)}
                variant={'outlined'}
                size={'small'}
                color={vacationState?.onVacation ? 'default' : tasks.conversations === 0 ? 'success' : 'primary'}
              ></Chip>
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="center" sx={{ width: '60px' }}>
          {!teamIsLoading && Boolean(tickets) && (
            <Tooltip title={'Назначенные тикеты'}>
              <Chip
                label={renderStateLabel(tickets, vacationState?.onVacation)}
                variant={'outlined'}
                size={'small'}
                color={
                  vacationState?.onVacation
                    ? 'default'
                    : Number(tickets) >= 3
                      ? 'error'
                      : Number(tickets) === 0
                        ? 'success'
                        : 'primary'
                }
              ></Chip>
            </Tooltip>
          )}
        </TableCell>
        <TableCell align="center" sx={{ width: '72px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setExpandRow(!expandRow);
            }}
          >
            {expandRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={expandRow} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Добавочный</TableCell>
                    <TableCell>Почта</TableCell>
                    <TableCell align="right">Телеграм</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={teammate.id}>
                    <TableCell>{teammate.extNumber}</TableCell>
                    <TableCell>{teammate.email}</TableCell>
                    <TableCell align="right">
                      {teammate.telegram && (
                        <Link
                          underline="none"
                          color="primary"
                          href={`https://t.me/${teammate.telegram}`}
                          target="_blank"
                        >
                          Написать
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});

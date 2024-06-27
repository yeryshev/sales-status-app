import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useSelector } from 'react-redux';
import { TeamRow } from './TeamRow';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import { Tooltip } from '@mui/material';
import {
  UsersAvatarsAndBirthday,
  UsersMango,
  UsersTasks,
  UsersTickets,
  UsersVacation,
} from '@/entities/Team/model/types/tasksWebsocket';
import { Teammate } from '@/entities/Team/model/types/teammate';
import { RowSkeleton } from '../RowSkeleton/RowSkeleton';
import Paper from '@mui/material/Paper';
import { getUserId } from '@/entities/User/model/selectors/userSelectors';
import { User } from '@/entities/User';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface TeamTableProps {
  teamList: Teammate[];
  mango: UsersMango;
  tasks: UsersTasks;
  tickets: UsersTickets;
  vacationStates: UsersVacation;
  avatarsAndBirthday: UsersAvatarsAndBirthday;
  teamIsLoading: boolean;
  isDeadlineReachedObject: Record<User['id'], boolean>;
}

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

export const TeamTable = memo((props: TeamTableProps) => {
  const {
    mango,
    tasks,
    tickets,
    teamIsLoading,
    teamList,
    vacationStates,
    avatarsAndBirthday,
    isDeadlineReachedObject,
  } = props;
  const userId = useSelector(getUserId);

  const filterTeamList = (teammate: Teammate) => {
    return teammate.isManager && teammate.id !== userId && !teammate.isCoordinator;
  };

  const filterCoordinators = (teammate: Teammate) => {
    return teammate.isCoordinator;
  };

  const renderTeamList = (teammate: Teammate) => (
    <TeamRow
      key={teammate.id}
      teammate={teammate}
      mango={mango[teammate.extNumber]}
      tasks={tasks[teammate.insideId]}
      tickets={tickets[teammate.insideId]}
      vacationState={vacationStates[teammate.insideId]}
      avatarsAndBirthday={avatarsAndBirthday[teammate.insideId]}
      isDeadlineReached={isDeadlineReachedObject[teammate.id]}
      teamIsLoading={teamIsLoading}
    />
  );

  return (
    <TableContainer style={{ overflowX: 'auto' }} component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="left"></TableCell>
            <Tooltip title={'Первичные обращения'}>
              <TableCell align="center">
                <RequestQuoteOutlinedIcon fontSize={'small'} />
              </TableCell>
            </Tooltip>
            <Tooltip title={'Просроченные задачи'}>
              <TableCell align="center">
                <HourglassBottomOutlinedIcon fontSize={'small'} />
              </TableCell>
            </Tooltip>
            <Tooltip title={'Количество открытых чатов'}>
              <TableCell align="center">
                <QuestionAnswerOutlinedIcon fontSize={'small'} />
              </TableCell>
            </Tooltip>
            <Tooltip title={'Назначенные тикеты'}>
              <TableCell align="center">
                <FeedbackOutlinedIcon fontSize={'small'} />
              </TableCell>
            </Tooltip>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamList.length > 0 ? teamList.filter(filterTeamList).map(renderTeamList) : null}
          <TableRow>
            <TableCell colSpan={9}>
              <Typography variant={'subtitle1'} display={'flex'} alignItems={'center'} gap={1}>
                Координаторы <ArrowDownwardIcon fontSize={'small'} />
              </Typography>
            </TableCell>
          </TableRow>
          {teamList.length > 0 ? teamList.filter(filterCoordinators).map(renderTeamList) : null}
          {teamIsLoading && getSkeletons()}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

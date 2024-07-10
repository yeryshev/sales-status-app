import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { TeamRow } from './TeamRow/TeamRow';
import { memo } from 'react';
import { styled } from '@mui/material/styles';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import {
  UsersAvatarsAndBirthday,
  UsersMango,
  UsersTasks,
  UsersTickets,
  UsersVacation,
} from '@/entities/Team/model/types/tasksWebsocket';
import { Teammate } from '@/entities/Team/model/types/teammate';
import { RowSkeleton } from '../RowSkeleton/RowSkeleton';
import { getUserData, getUserId } from '@/entities/User/model/selectors/userSelectors';
import { User } from '@/entities/User';
import { HeroRow } from './HeroRow/HeroRow';
import { getTeammate } from '@/entities/Team/model/selectors/teamSelectors';

interface TeamTableProps {
  teamList: Teammate[];
  mango: UsersMango;
  tasks: UsersTasks;
  tickets: UsersTickets;
  vacationStates: UsersVacation;
  avatarsAndBirthday: UsersAvatarsAndBirthday;
  teamIsLoading: boolean;
  isDeadlineReachedObject: Record<User['id'], boolean>;
  isAccountManagersRoute: boolean;
}

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
}));

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
    isAccountManagersRoute,
  } = props;

  const userId = useSelector(getUserId);
  const user = useSelector(getUserData);
  const teammate = useSelector(getTeammate);
  const userOnRightPage = user?.isAccountManager === isAccountManagersRoute;
  const shouldSeeHeroRow = !teamIsLoading && teammate && userOnRightPage;
  const teamListIsNotEmpty = teamList.length > 0;
  const thereAreCoordinators = teamList.find((teammate) => teammate.isCoordinator);

  const showManagers = (teammate: Teammate) => {
    return teammate.isManager && teammate.id !== userId && !teammate.isCoordinator;
  };

  const showCoordinators = (teammate: Teammate) => {
    return teammate.isCoordinator && teammate.id !== userId;
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
      isAccountManagersRoute={isAccountManagersRoute}
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
            {shouldSeeHeroRow ? (
              <Tooltip title={'Работаю из дома'}>
                <TableCell align="center">
                  <HomeOutlinedIcon fontSize={'small'} />
                </TableCell>
              </Tooltip>
            ) : (
              <TableCell align="center"></TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {shouldSeeHeroRow && (
            <>
              <HeroRow
                teammate={teammate}
                tasks={tasks[teammate.insideId]}
                tickets={tickets[teammate.insideId]}
                avatarsAndBirthday={avatarsAndBirthday[teammate.insideId]}
                teamIsLoading={teamIsLoading}
                isDeadlineReached={isDeadlineReachedObject[teammate.id]}
                isAccountManagersRoute={isAccountManagersRoute}
              />
              <StyledTableRow>
                <TableCell colSpan={9}></TableCell>
              </StyledTableRow>
            </>
          )}
          {teamListIsNotEmpty && teamList.filter(showManagers).map(renderTeamList)}
          {thereAreCoordinators && (
            <StyledTableRow>
              <TableCell colSpan={9}></TableCell>
            </StyledTableRow>
          )}
          {teamListIsNotEmpty && teamList.filter(showCoordinators).map(renderTeamList)}
          {teamIsLoading && getSkeletons()}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

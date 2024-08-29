import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { TeamRow } from './TeamRow/TeamRow';
import { memo } from 'react';
import { styled } from '@mui/material/styles';
import { getUserData, getUserId, getUserIsManager, User } from '@/entities/User';
import { HeroRow } from './HeroRow/HeroRow';
import {
  Teammate,
  UsersAvatarsAndBirthday,
  UsersMango,
  UsersTasks,
  UsersTickets,
  UsersVacation,
} from '@/entities/Team';
import { RowSkeleton } from '../RowSkeleton/RowSkeleton';
import { getTeamTableHeadersList } from './Headers/getTeamTableHeadersList';
import { TeamTableHeaderItem } from '../TeamTable/Headers/TeamTableHeaderItem';

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
  const userIsManager = useSelector(getUserIsManager);
  const userOnRightPage = user?.isAccountManager === isAccountManagersRoute;
  const shouldSeeHeroRow = !teamIsLoading && userIsManager && userOnRightPage;
  const teamListIsNotEmpty = teamList.length > 0;
  const thereAreCoordinators = teamList.find((teammate) => teammate.isCoordinator);
  const headersList = getTeamTableHeadersList(shouldSeeHeroRow);

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
            {headersList.map((header, index) => (
              <TeamTableHeaderItem key={index} item={header} />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {shouldSeeHeroRow && (
            <>
              <HeroRow
                teammate={user}
                tasks={tasks[user.insideId]}
                tickets={tickets[user.insideId]}
                avatarsAndBirthday={avatarsAndBirthday[user.insideId]}
                teamIsLoading={teamIsLoading}
                isDeadlineReached={isDeadlineReachedObject[user.id]}
                isAccountManagersRoute={isAccountManagersRoute}
              />
              <StyledTableRow>
                <TableCell colSpan={headersList.length}></TableCell>
              </StyledTableRow>
            </>
          )}
          {teamListIsNotEmpty && teamList.filter(showManagers).map(renderTeamList)}
          {thereAreCoordinators && (
            <StyledTableRow>
              <TableCell colSpan={headersList.length}></TableCell>
            </StyledTableRow>
          )}
          {teamListIsNotEmpty && teamList.filter(showCoordinators).map(renderTeamList)}
          {teamIsLoading && getSkeletons()}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

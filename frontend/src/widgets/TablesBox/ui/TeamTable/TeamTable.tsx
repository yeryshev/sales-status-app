import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { TeamRow } from './TeamRow/TeamRow';
import { memo } from 'react';
import { styled } from '@mui/material/styles';
import { RowSkeleton } from '../RowSkeleton/RowSkeleton';
import { getUserData, getUserId, getUserIsManager, User } from '@/entities/User';
import { HeroRow } from './HeroRow/HeroRow';
import { AdditionalUserData } from '@/entities/Team';
import { getTeamTableHeadersList } from './Headers/getTeamTableHeadersList';
import { TeamTableHeaderItem } from './Headers/TeamTableHeaderItem';

interface TeamTableProps {
  teamList: User[];
  teamIsLoading: boolean;
  isDeadlineReachedObject: Record<User['id'], boolean>;
  isAccountManagersRoute: boolean;
  additionalTeamData: Array<AdditionalUserData>;
}

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
}));

const matchAdditionalUserData = (usersData: Array<AdditionalUserData>, insideId: number) => {
  return (
    usersData?.find((data) => data.idInside === insideId) ?? {
      idAmoCRM: 0,
      idInside: 0,
      idChatwoot: 0,
      budget: {
        newSale: 0,
        newSaleAndUpsale: 0,
      },
      deals: {
        newSale: 0,
        newSaleAndUpsale: 0,
      },
      overdueTasks: 0,
      conversations: 0,
      tickets: 0,
      avatar: '',
      isBirthday: false,
      absence: {
        isAbsence: false,
        endDate: null,
        description: null,
      },
      mangoState: false,
      leads: 0,
      lastWeek: {
        budget: 0,
        deals: 0,
      },
    }
  );
};

export const TeamTable = memo((props: TeamTableProps) => {
  const { teamIsLoading, teamList, isDeadlineReachedObject, isAccountManagersRoute, additionalTeamData } = props;

  const userId = useSelector(getUserId);
  const user = useSelector(getUserData);
  const userIsManager = useSelector(getUserIsManager);
  const userOnRightPage = user?.isAccountManager === isAccountManagersRoute;
  const shouldSeeHeroRow = !teamIsLoading && userIsManager && userOnRightPage;
  const teamListIsNotEmpty = teamList.length > 0;
  const thereAreCoordinators = teamList.find((teammate) => teammate.isCoordinator);
  const headersList = getTeamTableHeadersList(shouldSeeHeroRow);

  const showManagers = (teammate: User) => {
    return teammate.isManager && teammate.id !== userId && !teammate.isCoordinator;
  };

  const showCoordinators = (teammate: User) => {
    return teammate.isCoordinator && teammate.id !== userId;
  };

  const renderTeamList = (teammate: User) => (
    <TeamRow
      key={teammate.id}
      teammate={teammate}
      additionalUserData={matchAdditionalUserData(additionalTeamData, teammate.insideId)}
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
                additionalUserData={matchAdditionalUserData(additionalTeamData, user.insideId)}
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

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Teammate, UsersAvatarsAndBirthday, UsersTasks } from '@/entities/Team';
import { RowSkeleton } from '../../RowSkeleton/RowSkeleton';
import { CurrentWeekResultRow } from './CurrentWeekResultRow';
import Paper from '@mui/material/Paper';

interface TeamTableProps {
  teamList: Teammate[];
  tasks: UsersTasks;
  avatarsAndBirthday: UsersAvatarsAndBirthday;
  teamIsLoading: boolean;
  isAccountManagersRoute: boolean;
}

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

export const CurrentWeekResultTable = memo((props: TeamTableProps) => {
  const { tasks, teamIsLoading, teamList, avatarsAndBirthday, isAccountManagersRoute } = props;

  const filterTeamList = (teammate: Teammate) => {
    const getDeals = tasks[teammate.insideId]?.deals || 0;
    return teammate.isManager && Number(getDeals) >= 0 && !teammate.isCoordinator;
  };

  const sortTeamListByDeals = (a: Teammate, b: Teammate) => {
    const getScoreA = tasks[a.insideId]?.deals || 0;
    const getScoreB = tasks[b.insideId]?.deals || 0;

    if (getScoreA === getScoreB) {
      const budgetA = tasks[a.insideId]?.budget || 0;
      const budgetB = tasks[b.insideId]?.budget || 0;
      return Number(budgetB) - Number(budgetA);
    }

    return Number(getScoreB) - Number(getScoreA);
  };

  const sortTeamListByBudget = (a: Teammate, b: Teammate) => {
    const budgetA = tasks[a.insideId]?.budget || 0;
    const budgetB = tasks[b.insideId]?.budget || 0;

    if (budgetA === budgetB) {
      const getScoreA = tasks[a.insideId]?.deals || 0;
      const getScoreB = tasks[b.insideId]?.deals || 0;
      return Number(getScoreB) - Number(getScoreA);
    }
    return Number(budgetB) - Number(budgetA);
  };

  const renderTeamList = (teammate: Teammate, index: number) => (
    <CurrentWeekResultRow
      key={teammate.id}
      teammate={teammate}
      tasks={tasks[teammate.insideId]}
      teamIsLoading={teamIsLoading}
      avatarsAndBirthday={avatarsAndBirthday[teammate.insideId]}
      index={index}
    />
  );

  return (
    <TableContainer style={{ overflowX: 'auto' }} component={Paper}>
      <Table size="small">
        <caption>За текущую неделю</caption>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">Успешных сделок</TableCell>
            <TableCell align="center">Бюджет</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamList.length > 0
            ? teamList
                .filter(filterTeamList)
                .sort(isAccountManagersRoute ? sortTeamListByBudget : sortTeamListByDeals)
                .map(renderTeamList)
            : null}
          {teamIsLoading && getSkeletons()}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

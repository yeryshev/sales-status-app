import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Teammate, UsersLastWeekStats, UsersTasks } from '@/entities/Team';
import { RowSkeleton } from '../../RowSkeleton/RowSkeleton';
import { LastWeekTableRow } from './LastWeekTableRow';
import Paper from '@mui/material/Paper';

interface TeamTableProps {
  teamList: Teammate[];
  tasks: UsersTasks;
  teamIsLoading: boolean;
  lastWeekStats: UsersLastWeekStats;
  isAccountManagersRoute: boolean;
}

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

export const LastWeekTable = memo((props: TeamTableProps) => {
  const { tasks, teamIsLoading, teamList, lastWeekStats, isAccountManagersRoute } = props;

  const filterTeamList = (teammate: Teammate) => {
    const getDeals = lastWeekStats[teammate.insideId]?.deals || 0;
    return teammate.isManager && Number(getDeals) >= 0 && !teammate.isCoordinator;
  };

  const sortTeamListByDeals = (a: Teammate, b: Teammate) => {
    const getScoreA = lastWeekStats[a.insideId]?.deals || 0;
    const getScoreB = lastWeekStats[b.insideId]?.deals || 0;

    if (getScoreA === getScoreB) {
      const budgetA = lastWeekStats[a.insideId]?.budget || 0;
      const budgetB = lastWeekStats[b.insideId]?.budget || 0;
      return Number(budgetB) - Number(budgetA);
    }

    return Number(getScoreB) - Number(getScoreA);
  };

  const sortTeamListByBudget = (a: Teammate, b: Teammate) => {
    const budgetA = lastWeekStats[a.insideId]?.budget || 0;
    const budgetB = lastWeekStats[b.insideId]?.budget || 0;

    if (budgetA === budgetB) {
      const getScoreA = lastWeekStats[a.insideId]?.deals || 0;
      const getScoreB = lastWeekStats[b.insideId]?.deals || 0;
      return Number(getScoreB) - Number(getScoreA);
    }
    return Number(budgetB) - Number(budgetA);
  };

  const renderTeamList = (teammate: Teammate, index: number) => (
    <LastWeekTableRow
      key={teammate.id}
      teammate={teammate}
      tasks={tasks[teammate.insideId]}
      teamIsLoading={teamIsLoading}
      lastWeekStats={lastWeekStats[teammate.insideId]}
      index={index}
    />
  );

  return (
    <TableContainer style={{ overflowX: 'auto' }} component={Paper}>
      <Table size="small">
        <caption>За прошлую неделю</caption>
        <TableHead>
          <TableRow>
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

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { UsersLastWeekStats, UsersTasks } from '../../../../../entities/Team/model/types/tasksWebsocket';
import { Teammate } from '../../../../../entities/Team/model/types/teammate';
import { RowSkeleton } from '../../RowSkeleton/RowSkeleton';
import { LastWeekTableRow } from './LastWeekTableRow';

interface TeamTableProps {
  teamList: Teammate[];
  tasks: UsersTasks;
  teamIsLoading: boolean;
  lastWeekStats: UsersLastWeekStats;
}

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

export const LastWeekTable = memo((props: TeamTableProps) => {
  const { tasks, teamIsLoading, teamList, lastWeekStats } = props;

  const filterTeamList = (teammate: Teammate) => {
    const getScore = lastWeekStats[teammate.insideId] ? lastWeekStats[teammate.insideId] : 0;
    return teammate.secondName && teammate.firstName && Number(getScore) >= 0;
  };

  const sortTeamList = (a: Teammate, b: Teammate) => {
    const getScoreA = lastWeekStats[a.insideId] ? lastWeekStats[a.insideId] : 0;
    const getScoreB = lastWeekStats[b.insideId] ? lastWeekStats[b.insideId] : 0;
    return Number(getScoreB) - Number(getScoreA);
  };

  const renderTeamList = (teammate: Teammate) => (
    <LastWeekTableRow
      key={teammate.id}
      teammate={teammate}
      tasks={tasks[teammate.insideId]}
      teamIsLoading={teamIsLoading}
      lastWeekStats={lastWeekStats[teammate.insideId]}
    />
  );

  return (
    <TableContainer style={{ overflowX: 'auto' }}>
      <Table size="small">
        <caption>Рейтинг менеджеров по новым клиентам за прошлую неделю</caption>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left"></TableCell>
            <TableCell align="left">Успех</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teamList.length > 0 ? teamList.filter(filterTeamList).sort(sortTeamList).map(renderTeamList) : null}
          {teamIsLoading && getSkeletons()}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

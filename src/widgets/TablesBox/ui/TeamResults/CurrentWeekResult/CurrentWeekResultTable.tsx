import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { UsersTasks } from '@/entities/Team/model/types/tasksWebsocket';
import { Teammate } from '@/entities/Team/model/types/teammate';
import { RowSkeleton } from '../../RowSkeleton/RowSkeleton';
import { CurrentWeekResultRow } from './CurrentWeekResultRow';
import Paper from '@mui/material/Paper';

interface TeamTableProps {
  teamList: Teammate[];
  tasks: UsersTasks;
  teamIsLoading: boolean;
}

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

const coordinatorsString = import.meta.env.VITE_COORDINATORS;
const coordinatorsArray = coordinatorsString ? coordinatorsString.split(',') : [];

export const CurrentWeekResultTable = memo((props: TeamTableProps) => {
  const { tasks, teamIsLoading, teamList } = props;

  const filterTeamList = (teammate: Teammate) => {
    const getDeals = tasks[teammate.insideId]?.deals || 0;
    return (
      teammate.secondName &&
      teammate.firstName &&
      Number(getDeals) >= 0 &&
      !coordinatorsArray.includes(String(teammate.id))
    );
  };

  const sortTeamList = (a: Teammate, b: Teammate) => {
    const getScoreA = tasks[a.insideId]?.deals || 0;
    const getScoreB = tasks[b.insideId]?.deals || 0;

    return Number(getScoreB) - Number(getScoreA);
  };

  const renderTeamList = (teammate: Teammate, index: number) => (
    <CurrentWeekResultRow
      key={teammate.id}
      teammate={teammate}
      tasks={tasks[teammate.insideId]}
      teamIsLoading={teamIsLoading}
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
          {teamList.length > 0 ? teamList.filter(filterTeamList).sort(sortTeamList).map(renderTeamList) : null}
          {teamIsLoading && getSkeletons()}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

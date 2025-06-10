import { memo } from 'react';
import { useSelector } from 'react-redux';
import { TableContainer, Table, TableBody, Typography, Paper } from '@mui/material';

import { getUserData } from '@/entities/User';
import { createSkeletons } from '../../lib/teamDataHelpers';
import { TeamResultsRowSkeleton } from './TeamResultsRowSkeleton';
import { getTotalBudget } from './getTotalBudget';
import { TeamResultsTableProps } from './types';
import { DEFAULT_SKELETON_COUNT } from './constants';
import { useTeamResultsTable } from './hooks/useTeamResultsTable';
import { TeamResultsTableHead } from './TeamResultsTableHead';
import { TeamResultsRow } from './TeamResultsRow';

export const TeamResultsTable = memo((props: TeamResultsTableProps) => {
  const { type, teamIsLoading, teamList, additionalTeamData } = props;
  const user = useSelector(getUserData);

  const isCurrentWeek = type === 'currentWeek';

  const { order, orderBy, handleRequestSort, filteredTeamList, sortedRows, topBudgetUsers } = useTeamResultsTable(
    teamList,
    additionalTeamData,
    isCurrentWeek,
  );

  const totalBudget = getTotalBudget(filteredTeamList, additionalTeamData, isCurrentWeek);
  const skeletonKeys = createSkeletons(DEFAULT_SKELETON_COUNT);

  return (
    <TableContainer style={{ overflowX: 'auto' }} component={Paper}>
      <Typography variant="h6" p={2} color="primary.main" borderBottom="1px solid" borderColor="divider">
        {isCurrentWeek ? 'Текущая неделя' : 'Прошлая неделя'}
      </Typography>

      <Table size="small">
        <caption
          style={{
            textAlign: 'right',
            paddingRight: '16px',
            captionSide: 'bottom',
          }}
        >
          {`Итого ${totalBudget} ₽`}
        </caption>

        <TeamResultsTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />

        <TableBody>
          {sortedRows.map((row) => (
            <TeamResultsRow
              key={row.id}
              row={row}
              isCurrentWeek={isCurrentWeek}
              topBudgetUsers={topBudgetUsers}
              isSelected={row.id === user?.id}
            />
          ))}

          {teamIsLoading && skeletonKeys.map((key) => <TeamResultsRowSkeleton key={key} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

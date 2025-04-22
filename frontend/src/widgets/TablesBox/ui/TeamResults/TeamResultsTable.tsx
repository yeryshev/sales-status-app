import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { memo, useState, MouseEvent, useMemo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Teammate, UsersAvatarsAndBirthday, UsersLastWeekStats, UsersTasks } from '@/entities/Team';
import { RowSkeleton } from '../RowSkeleton/RowSkeleton';
import Paper from '@mui/material/Paper';
import { getTotalBudget } from './getTotalBudget';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/User';

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <RowSkeleton key={index} />);

const medalMapper: Record<number, string> = {
  0: '🥇',
  1: '🥈',
  2: '🥉',
};

interface Data {
  id: number;
  avatar: string;
  name: string;
  deals: number;
  budget: number;
}

function createData(id: number, avatar: string, name: string, deals: number, budget: number): Data {
  return {
    id,
    avatar,
    name,
    deals,
    budget,
  };
}

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof Data>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'avatar',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: '',
  },
  {
    id: 'deals',
    numeric: true,
    disablePadding: false,
    label: 'Успешых сделок',
  },
  {
    id: 'budget',
    numeric: true,
    disablePadding: false,
    label: 'Бюджет',
  },
];

const columnToSort = (headId: HeadCell['id']) => {
  return headId === 'deals' || headId === 'budget';
};

interface SortedTableProps {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function SortedTableHead(props: SortedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={columnToSort(headCell.id) ? 'center' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {columnToSort(headCell.id) && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface TeamResultsTableProps {
  type: 'currentWeek' | 'lastWeek';
  teamList: Teammate[];
  tasks: UsersTasks;
  lastWeekStats: UsersLastWeekStats;
  avatarsAndBirthday: UsersAvatarsAndBirthday;
  teamIsLoading: boolean;
  isAccountManagersRoute: boolean;
}

export const TeamResultsTable = memo((props: TeamResultsTableProps) => {
  const { type, tasks, lastWeekStats, teamIsLoading, teamList, avatarsAndBirthday } = props;
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('budget');
  const user = useSelector(getUserData);

  const isCurrentWeek = type === 'currentWeek';

  const filterTeamList = (teammate: Teammate) => {
    const getDeals = tasks[teammate.insideId]?.deals || 0;
    return teammate.isManager && Number(getDeals) >= 0 && !teammate.isCoordinator;
  };

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const rows = teamList.filter(filterTeamList).map((teammate) => {
    const deals = isCurrentWeek
      ? Number(tasks[teammate.insideId]?.deals) || 0
      : Number(lastWeekStats[teammate.insideId]?.deals) || 0;

    const budget = isCurrentWeek
      ? Number(tasks[teammate.insideId]?.budget) || 0
      : Number(lastWeekStats[teammate.insideId]?.budget) || 0;

    return createData(
      teammate.id,
      avatarsAndBirthday[teammate.insideId]?.avatar,
      `${teammate.firstName} ${teammate.secondName}`,
      deals,
      budget,
    );
  });

  const visibleRows = useMemo(() => [...rows].sort(getComparator(order, orderBy)), [order, orderBy, rows]);

  const topBudgetTeammates = useMemo(() => {
    return [...rows]
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 3)
      .reduce(
        (acc, teammate, index) => {
          acc[teammate.id] = medalMapper[index] || '';
          return acc;
        },
        {} as Record<number, string>,
      );
  }, [rows]);

  return (
    <TableContainer style={{ overflowX: 'auto' }} component={Paper}>
      <Table size="small">
        {isCurrentWeek ? (
          <caption>{`За текущую неделю собрано ${getTotalBudget(teamList, tasks).toLocaleString('ru-RU')} ₽`}</caption>
        ) : (
          <caption>{`За прошлую неделю собрано ${getTotalBudget(teamList, lastWeekStats).toLocaleString('ru-RU')} ₽`}</caption>
        )}
        <SortedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
        <TableBody>
          {visibleRows.map((row) => {
            return (
              <TableRow
                hover
                tabIndex={-1}
                key={row.id}
                sx={{ cursor: 'pointer', height: 63 }}
                selected={row.id === user?.id}
              >
                {isCurrentWeek ? (
                  <TableCell align="left">
                    <Avatar alt={row.name} src={row.avatar} sx={{ width: 50, height: 50 }} />
                  </TableCell>
                ) : (
                  <TableCell align="left"></TableCell>
                )}
                <TableCell align="left">
                  {isCurrentWeek ? (
                    <Typography variant={'body2'}>{row.name}</Typography>
                  ) : (
                    <Typography variant={'body2'}>{`${row.name} ${topBudgetTeammates[row.id] || ''}`}</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Typography variant={'body2'}>{row.deals}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant={'body2'}>{row.budget.toLocaleString('ru-RU')}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
          {teamIsLoading && getSkeletons()}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

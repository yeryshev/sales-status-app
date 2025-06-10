import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { memo, useState, MouseEvent, useMemo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { AdditionalUserData } from '@/entities/Team';
import { TeamResultsRowSkeleton } from './TeamResultsRowSkeleton';
import Paper from '@mui/material/Paper';
import { getTotalBudget } from './getTotalBudget';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { getUserData, User } from '@/entities/User';

const getSkeletons = () => new Array(10).fill(0).map((_, index) => <TeamResultsRowSkeleton key={index} />);

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
  teamList: User[];
  teamIsLoading: boolean;
  isAccountManagersRoute: boolean;
  additionalTeamData: Array<AdditionalUserData>;
}

const matchAdditionalUserData = (usersData: Array<AdditionalUserData>, insideId: number) => {
  return usersData.find((data) => data.idInside === insideId);
};

export const TeamResultsTable = memo((props: TeamResultsTableProps) => {
  const { type, teamIsLoading, teamList, additionalTeamData } = props;
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('budget');
  const user = useSelector(getUserData);

  const isCurrentWeek = type === 'currentWeek';

  const filterTeamList = (teammate: User) => {
    const additionalUserData = matchAdditionalUserData(additionalTeamData, teammate.insideId);

    const getDeals = additionalUserData?.deals.newSale || 0;
    return teammate.isManager && Number(getDeals) >= 0 && !teammate.isCoordinator;
  };

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const teamListOnlyMangers = teamList.filter(filterTeamList);

  const rows = teamListOnlyMangers.map((teammate) => {
    const additionalUserData = matchAdditionalUserData(additionalTeamData, teammate.insideId);

    const deals = isCurrentWeek
      ? Number(additionalUserData?.deals.newSale) || 0
      : Number(additionalUserData?.lastWeek.deals) || 0;

    const budget = isCurrentWeek
      ? Number(additionalUserData?.budget.newSaleAndUpsale) || 0
      : Number(additionalUserData?.lastWeek.budget) || 0;

    return createData(
      teammate.id,
      additionalUserData?.avatar || '',
      `${teammate.firstName} ${teammate.secondName}`,
      deals,
      budget,
    );
  });

  const visibleRows = useMemo(() => [...rows].sort(getComparator(order, orderBy)), [order, orderBy, rows]);

  const topBudgetUsers = useMemo(() => {
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
          <caption>{`За текущую неделю собрано ${getTotalBudget(
            teamListOnlyMangers,
            additionalTeamData,
            true,
          )} ₽`}</caption>
        ) : (
          <caption>{`За прошлую неделю собрано ${getTotalBudget(teamListOnlyMangers, additionalTeamData, false)} ₽`}</caption>
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
                    <Typography variant={'body2'}>{`${row.name} ${topBudgetUsers[row.id] || ''}`}</Typography>
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

import { useState, useMemo, useCallback, MouseEvent } from 'react';
import { User } from '@/entities/User';
import { AdditionalUserData } from '@/entities/Team';
import { TeamResultsData, SortOrder } from '../types';
import { filterManagersOnly, mapTeammateToResultsData, getComparator, calculateTopBudgetUsers } from '../utils';

export const useTeamResultsTable = (
  teamList: User[],
  additionalTeamData: Array<AdditionalUserData>,
  isCurrentWeek: boolean,
) => {
  const [order, setOrder] = useState<SortOrder>('desc');
  const [orderBy, setOrderBy] = useState<keyof TeamResultsData>('budget');

  const handleRequestSort = useCallback(
    (_: MouseEvent<unknown>, property: keyof TeamResultsData) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy],
  );

  const filteredTeamList = useMemo(
    () => teamList.filter((teammate) => filterManagersOnly(teammate, additionalTeamData)),
    [teamList, additionalTeamData],
  );

  const rows = useMemo(
    () => filteredTeamList.map((teammate) => mapTeammateToResultsData(teammate, additionalTeamData, isCurrentWeek)),
    [filteredTeamList, additionalTeamData, isCurrentWeek],
  );

  const sortedRows = useMemo(() => [...rows].sort(getComparator(order, orderBy)), [rows, order, orderBy]);

  const topBudgetUsers = useMemo(() => calculateTopBudgetUsers(rows), [rows]);

  return {
    order,
    orderBy,
    handleRequestSort,
    filteredTeamList,
    sortedRows,
    topBudgetUsers,
  };
};

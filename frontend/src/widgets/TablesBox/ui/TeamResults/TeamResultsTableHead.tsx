import { memo } from 'react';
import { TableHead, TableRow, TableCell, TableSortLabel, Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { SortedTableHeadProps, TeamResultsData } from './types';
import { HEAD_CELLS, SORTABLE_COLUMNS } from './constants';

export const TeamResultsTableHead = memo((props: SortedTableHeadProps) => {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: keyof TeamResultsData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const isSortableColumn = (headId: string) => SORTABLE_COLUMNS.has(headId);

  return (
    <TableHead>
      <TableRow>
        {HEAD_CELLS.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={isSortableColumn(headCell.id) ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {isSortableColumn(headCell.id) ? (
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
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});

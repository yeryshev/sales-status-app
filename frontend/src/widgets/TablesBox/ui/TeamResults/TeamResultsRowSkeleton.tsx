import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Skeleton } from '@mui/material';

export const TeamResultsRowSkeleton = memo(() => {
  return (
    <TableRow hover={true} sx={{ height: 63 }}>
      {/* Аватар */}
      <TableCell align="left">
        <Skeleton variant="circular" width={50} height={50} />
      </TableCell>
      {/* Имя */}
      <TableCell align="left">
        <Skeleton variant="text" width="80%" />
      </TableCell>
      {/* Сделки */}
      <TableCell align="center">
        <Skeleton variant="text" width={30} />
      </TableCell>
      {/* Бюджет */}
      <TableCell align="center">
        <Skeleton variant="text" width={80} />
      </TableCell>
    </TableRow>
  );
});

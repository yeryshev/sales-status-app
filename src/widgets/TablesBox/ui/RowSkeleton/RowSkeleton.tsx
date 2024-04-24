import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Skeleton } from '@mui/material';

export const RowSkeleton = memo(() => {
  return (
    <TableRow hover={true}>
      <TableCell align="left" sx={{ width: '50px' }}>
        <Skeleton variant="circular" width={50} height={50} />
      </TableCell>
      <TableCell align="left" sx={{ width: '180px' }}>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="left" sx={{ width: '110px' }}>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="center" sx={{ width: '60px' }}>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="center" sx={{ width: '72px' }}>
        <Skeleton variant="text" />
      </TableCell>
    </TableRow>
  );
});

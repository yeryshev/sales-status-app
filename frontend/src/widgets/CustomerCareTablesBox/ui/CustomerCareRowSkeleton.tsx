import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Skeleton } from '@mui/material';
import { CELL_WIDTHS } from '@/widgets/TablesBox';

export const CustomerCareRowSkeleton = memo(() => {
  return (
    <TableRow hover={true}>
      {/* Аватар */}
      <TableCell align="left" width={CELL_WIDTHS.AVATAR}>
        <Skeleton variant="circular" width={50} height={50} />
      </TableCell>
      {/* Имя пользователя */}
      <TableCell align="left" width={CELL_WIDTHS.USER_NAME}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Статус */}
      <TableCell align="left" width={CELL_WIDTHS.STATUS}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Комментарий */}
      <TableCell align="left" width={CELL_WIDTHS.COMMENT}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Стрелка */}
      <TableCell align="center" width={CELL_WIDTHS.ARROW_DOWN}>
        <Skeleton variant="text" />
      </TableCell>
    </TableRow>
  );
});

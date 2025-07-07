import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Skeleton } from '@mui/material';
import { CELL_WIDTHS } from '../TeamTable/constants';

export const RowSkeleton = memo(() => {
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
      {/* Qlik */}
      <TableCell align="left" width={CELL_WIDTHS.QLIK}>
        <Skeleton variant="text" />
      </TableCell>
      {/* AmoCRM */}
      <TableCell align="left" width={CELL_WIDTHS.AMO_CRM}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Лиды */}
      <TableCell align="center" width={CELL_WIDTHS.LEADS}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Задачи */}
      <TableCell align="center" width={CELL_WIDTHS.TASKS}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Разговоры */}
      <TableCell align="center" width={CELL_WIDTHS.CONVERSATIONS}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Тикеты */}
      <TableCell align="center" width={CELL_WIDTHS.TICKETS}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Стрелка */}
      <TableCell align="center" width={CELL_WIDTHS.ARROW_DOWN}>
        <Skeleton variant="text" />
      </TableCell>
    </TableRow>
  );
});

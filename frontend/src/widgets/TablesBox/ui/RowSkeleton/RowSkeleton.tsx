import { memo } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Skeleton } from '@mui/material';

export const RowSkeleton = memo(() => {
  return (
    <TableRow hover={true}>
      {/* Аватар */}
      <TableCell align="left" width={50}>
        <Skeleton variant="circular" width={50} height={50} />
      </TableCell>
      {/* Имя пользователя */}
      <TableCell align="left" width={160}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Статус */}
      <TableCell align="left" width={160}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Комментарий */}
      <TableCell align="left" width={250}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Qlik */}
      <TableCell align="left" width={120}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Сделки */}
      <TableCell align="center" width={60}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Бюджет - без фиксированной ширины как в оригинале */}
      <TableCell align="left">
        <Skeleton variant="text" />
      </TableCell>
      {/* Лиды */}
      <TableCell align="center" width={60}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Задачи */}
      <TableCell align="center" width={60}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Разговоры */}
      <TableCell align="center" width={60}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Тикеты */}
      <TableCell align="center" width={60}>
        <Skeleton variant="text" />
      </TableCell>
      {/* Стрелка */}
      <TableCell align="center" width={72}>
        <Skeleton variant="text" />
      </TableCell>
    </TableRow>
  );
});

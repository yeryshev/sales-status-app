import { memo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useGetTgChats } from '../api/ChatsTableApi';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink, Skeleton } from '@mui/material';

const ChatsRowSkeleton = memo(() => {
  return (
    <TableRow>
      <TableCell component="th" scope="row" width={'190px'}>
        <Skeleton variant={'text'} />
      </TableCell>
      <TableCell align="left">
        <Skeleton variant={'text'} />
      </TableCell>
    </TableRow>
  );
});

const getSkeletons = () => new Array(12).fill(0).map((_, index) => <ChatsRowSkeleton key={index} />);

export const ChatsTable = memo(() => {
  const { data: rows, isLoading } = useGetTgChats();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="chats table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="left">Описание</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? getSkeletons()
            : rows?.chats.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <MuiLink component={RouterLink} to={row.link} key={row.id} target={'_blank'}>
                      {row.name}
                    </MuiLink>
                  </TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

import { memo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useGetTgChats } from '../api/TgChatsApi';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

export const TgChatsTable = memo(() => {
  const { data: rows } = useGetTgChats();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="left">Описание</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.chats.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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

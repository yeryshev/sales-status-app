import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import LanguageIcon from '@mui/icons-material/Language';
import { Teammate } from '../../../../types/Team';
import { Avatar, Link, Skeleton } from '@mui/material';
import styles from './Row.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

const Row = ({ teammate }: { teammate: Teammate }) => {
  const [open, setOpen] = useState(false);
  const loading = useSelector((state: RootState) => state.team.loading);

  return (
    <>
      <TableRow key={teammate.id} hover>
        <TableCell align="left">
          {loading ? (
            <Skeleton variant="circular" width={50} height={50} />
          ) : (
            <Avatar
              alt={`${teammate.firstName} ${teammate.secondName}`}
              src={teammate.photoUrl}
              sx={{ width: 50, height: 50 }}
            />
          )}
        </TableCell>
        <TableCell align="left">
          {loading ? (
            <Skeleton variant="text" />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {`${teammate.firstName} ${teammate.secondName}`}
              {teammate.isWorkingRemotely && <LanguageIcon />}
            </div>
          )}
        </TableCell>
        <TableCell align="left">
          {loading ? (
            <Skeleton variant="text" />
          ) : (
            <span className={`${styles.status} ${styles[`status--${teammate.status}`]}`}>
              {teammate.status}
            </span>
          )}
        </TableCell>
        <TableCell align="left">
          {loading ? <Skeleton variant="text" /> : teammate.comment}
        </TableCell>
        <TableCell align="right">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Добавочный</TableCell>
                    <TableCell>Почта</TableCell>
                    <TableCell align="right">Телеграм</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={teammate.id}>
                    <TableCell>{teammate.extNumber}</TableCell>
                    <TableCell>{teammate.email}</TableCell>
                    <TableCell align="right">
                      <Link
                        underline="none"
                        color="primary"
                        href={`http://t.me/${teammate.telegram}`}
                        target="_blank"
                      >
                        Написать
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;

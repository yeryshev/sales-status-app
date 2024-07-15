import { memo } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { Link } from '@mui/material';
import { Teammate } from '@/entities/Team';

interface ExpandRowProps {
  teammate: Teammate;
  expandRow: boolean;
}

export const ExpandRow = memo((props: ExpandRowProps) => {
  const { teammate, expandRow } = props;

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
        <Collapse in={expandRow} timeout="auto" unmountOnExit>
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
                    {teammate.telegram && (
                      <Link underline="none" color="primary" href={`https://t.me/${teammate.telegram}`} target="_blank">
                        Написать
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
});

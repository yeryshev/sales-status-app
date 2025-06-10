import { memo } from 'react';
import { TableRow, TableCell } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SeparatorRowProps } from './types';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
}));

export const SeparatorRow = memo((props: SeparatorRowProps) => {
  const { colSpan } = props;

  return (
    <StyledTableRow>
      <TableCell colSpan={colSpan} />
    </StyledTableRow>
  );
});

import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ArrowDownCellProps {
  expandRow: boolean;
  setExpandRow: (value: boolean) => void;
}

export const ArrowDownCell = memo((props: ArrowDownCellProps) => {
  const { expandRow, setExpandRow } = props;

  return (
    <IconButton
      aria-label="expand row"
      size="small"
      onClick={() => {
        setExpandRow(!expandRow);
      }}
    >
      {expandRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
  );
});

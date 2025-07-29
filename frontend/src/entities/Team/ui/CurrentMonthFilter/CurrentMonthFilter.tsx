import { memo } from 'react';
import { FormControlLabel, Checkbox, Typography, Paper } from '@mui/material';

interface CurrentMonthFilterProps {
  showCurrentMonth: boolean;
  onToggle: (checked: boolean) => void;
}

export const CurrentMonthFilter = memo((props: CurrentMonthFilterProps) => {
  const { showCurrentMonth, onToggle } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked);
  };

  return (
    <Paper variant="outlined" sx={{ mb: 3, p: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            id="current-month-checkbox"
            name="current-month-checkbox"
            checked={showCurrentMonth}
            onChange={handleChange}
            color="primary"
          />
        }
        label={<Typography variant="body2">Учитывать текущий месяц</Typography>}
      />
    </Paper>
  );
});

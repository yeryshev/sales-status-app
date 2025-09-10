import { memo } from 'react';
import { FormControlLabel, Checkbox, Typography, Paper } from '@mui/material';

interface CurrentMonthFilterProps {
  showNextMonth: boolean;
  onToggle: (checked: boolean) => void;
}

export const CurrentMonthFilter = memo((props: CurrentMonthFilterProps) => {
  const { showNextMonth, onToggle } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked);
  };

  const labelText = 'Учитывать текущий месяц для всех графиков';

  return (
    <Paper variant="outlined" sx={{ mb: 3, p: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            id="next-month-checkbox"
            name="next-month-checkbox"
            checked={showNextMonth}
            onChange={handleChange}
            color="primary"
          />
        }
        label={<Typography variant="body2">{labelText}</Typography>}
      />
    </Paper>
  );
});

import { memo } from 'react';
import { FormControlLabel, Checkbox, Box, Typography } from '@mui/material';

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
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <FormControlLabel
        control={<Checkbox checked={showCurrentMonth} onChange={handleChange} color="primary" />}
        label={
          <Typography variant="body2" color="text.primary">
            Учитывать текущий месяц
          </Typography>
        }
      />
    </Box>
  );
});

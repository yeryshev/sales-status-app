import { memo } from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface IncludeForecastCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const IncludeForecastCheckbox = memo((props: IncludeForecastCheckboxProps) => {
  const { checked, onChange } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          id="include-forecast-checkbox"
          name="include-forecast"
          checked={checked}
          onChange={handleChange}
          size="small"
        />
      }
      label="Учитывать прогноз"
      htmlFor="include-forecast-checkbox"
    />
  );
});

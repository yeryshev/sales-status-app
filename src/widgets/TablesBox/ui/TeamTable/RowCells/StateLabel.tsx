import Typography from '@mui/material/Typography';

export const StateLabel = (label: string | number, onVacation: boolean = false) => {
  return onVacation ? (
    <Typography color={'text.secondary'} sx={{ opacity: 0.5 }} variant={'body2'}>
      {String(label)}
    </Typography>
  ) : (
    <Typography variant={'body2'}>{String(label)}</Typography>
  );
};

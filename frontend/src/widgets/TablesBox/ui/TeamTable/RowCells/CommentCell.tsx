import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { AdditionalUserData } from '@/entities/Team';

const renderVacationDay = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const formatter = new Intl.DateTimeFormat('ru', options);
  return formatter.format(date);
};

interface CommentCellProps {
  absence: AdditionalUserData['absence'];
}

export const CommentCell = memo((props: CommentCellProps) => {
  const { absence } = props;

  return absence?.endDate ? (
    <Typography color={'text.secondary'} sx={{ opacity: 0.5 }} variant={'body2'}>
      до {renderVacationDay(absence?.endDate)}
    </Typography>
  ) : (
    ''
  );
});

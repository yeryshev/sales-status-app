import { memo } from 'react';
import Typography from '@mui/material/Typography';
import { UserVacation } from '@/entities/Team/model/types/tasksWebsocket';

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
  vacationState?: UserVacation;
}

export const CommentCell = memo((props: CommentCellProps) => {
  const { vacationState } = props;

  return vacationState?.endDate ? (
    <Typography color={'text.secondary'} sx={{ opacity: 0.5 }} variant={'body2'}>
      до {renderVacationDay(vacationState?.endDate)}
    </Typography>
  ) : (
    // teammate.comment?.description
    ''
  );
});

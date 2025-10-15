import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { AdditionalUserData } from '@/entities/Team';
import { generateTasksUrl } from './urlUtils';

interface TasksCellProps {
  overdueTasks: AdditionalUserData['overdueTasks'];
  absence?: AdditionalUserData['absence'];
  idAmoCRM?: number;
}

export const TasksCell = memo((props: TasksCellProps) => {
  const { overdueTasks, absence, idAmoCRM } = props;

  const handleClick = () => {
    if (idAmoCRM && overdueTasks && overdueTasks > 0) {
      const url = generateTasksUrl(idAmoCRM);
      window.open(url, '_blank');
    }
  };

  return (
    Boolean(overdueTasks) && (
      <Tooltip title={'Просроченные задачи'}>
        <Chip
          label={StateLabel(overdueTasks, absence?.isAbsence)}
          variant={'outlined'}
          size={'small'}
          color={
            absence?.isAbsence ? 'default' : overdueTasks >= 5 ? 'error' : overdueTasks === 0 ? 'success' : 'primary'
          }
          onClick={handleClick}
          sx={{
            cursor: idAmoCRM && overdueTasks > 0 ? 'pointer' : 'default',
            '&:hover':
              idAmoCRM && overdueTasks > 0
                ? {
                    opacity: 0.8,
                    transform: 'scale(1.02)',
                  }
                : {},
          }}
        ></Chip>
      </Tooltip>
    )
  );
});

import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { AdditionalUserData } from '@/entities/Team';

interface TasksCellProps {
  overdueTasks: AdditionalUserData['overdueTasks'];
  absence?: AdditionalUserData['absence'];
}

export const TasksCell = memo((props: TasksCellProps) => {
  const { overdueTasks, absence } = props;

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
        ></Chip>
      </Tooltip>
    )
  );
});

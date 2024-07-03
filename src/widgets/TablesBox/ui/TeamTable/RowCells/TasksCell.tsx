import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { UserTasks, UserVacation } from '@/entities/Team/model/types/tasksWebsocket';

interface TasksCellProps {
  teamIsLoading: boolean;
  tasks: UserTasks;
  vacationState?: UserVacation;
}

export const TasksCell = memo((props: TasksCellProps) => {
  const { teamIsLoading, tasks, vacationState } = props;

  return (
    !teamIsLoading &&
    tasks &&
    Boolean(tasks.tasks) && (
      <Tooltip title={'Просроченные задачи'}>
        <Chip
          label={StateLabel(tasks.tasks, vacationState?.onVacation)}
          variant={'outlined'}
          size={'small'}
          color={
            vacationState?.onVacation
              ? 'default'
              : tasks.tasks >= 5
                ? 'error'
                : tasks.tasks === 0
                  ? 'success'
                  : 'primary'
          }
        ></Chip>
      </Tooltip>
    )
  );
});

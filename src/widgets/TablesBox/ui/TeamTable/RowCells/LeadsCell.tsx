import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { UserTasks, UserVacation } from '@/entities/Team/model/types/tasksWebsocket';
import { StateLabel } from './StateLabel';

interface LeadsCellProps {
  teamIsLoading: boolean;
  tasks: UserTasks;
  vacationState?: UserVacation;
}

export const LeadsCell = memo((props: LeadsCellProps) => {
  const { teamIsLoading, tasks, vacationState } = props;

  return (
    !teamIsLoading &&
    tasks &&
    Boolean(tasks.leads) && (
      <Tooltip title={'Первичные обращения'}>
        <Chip
          label={StateLabel(tasks.leads, vacationState?.onVacation)}
          variant={'outlined'}
          size={'small'}
          color={
            vacationState?.onVacation
              ? 'default'
              : tasks.leads >= 5
                ? 'error'
                : tasks.leads === 0
                  ? 'success'
                  : 'primary'
          }
        ></Chip>
      </Tooltip>
    )
  );
});

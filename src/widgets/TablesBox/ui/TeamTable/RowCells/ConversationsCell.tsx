import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { UserTasks, UserVacation } from '@/entities/Team/model/types/tasksWebsocket';

interface ConversationsCellProps {
  teamIsLoading: boolean;
  tasks: UserTasks;
  vacationState?: UserVacation;
}

export const ConversationsCell = memo((props: ConversationsCellProps) => {
  const { teamIsLoading, tasks, vacationState } = props;

  return (
    !teamIsLoading &&
    tasks &&
    Boolean(tasks.conversations) && (
      <Tooltip title={'Количество открытых чатов'}>
        <Chip
          label={StateLabel(tasks.conversations, vacationState?.onVacation)}
          variant={'outlined'}
          size={'small'}
          color={vacationState?.onVacation ? 'default' : tasks.conversations === 0 ? 'success' : 'primary'}
        ></Chip>
      </Tooltip>
    )
  );
});

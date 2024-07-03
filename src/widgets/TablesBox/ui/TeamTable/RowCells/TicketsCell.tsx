import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { UserTickets, UserVacation } from '@/entities/Team/model/types/tasksWebsocket';

interface TicketsCellProps {
  teamIsLoading: boolean;
  tickets: UserTickets;
  vacationState?: UserVacation;
}

export const TicketsCell = memo((props: TicketsCellProps) => {
  const { teamIsLoading, tickets, vacationState } = props;

  return (
    !teamIsLoading &&
    Boolean(tickets) && (
      <Tooltip title={'Назначенные тикеты'}>
        <Chip
          label={StateLabel(tickets, vacationState?.onVacation)}
          variant={'outlined'}
          size={'small'}
          color={
            vacationState?.onVacation
              ? 'default'
              : Number(tickets) >= 3
                ? 'error'
                : Number(tickets) === 0
                  ? 'success'
                  : 'primary'
          }
        ></Chip>
      </Tooltip>
    )
  );
});

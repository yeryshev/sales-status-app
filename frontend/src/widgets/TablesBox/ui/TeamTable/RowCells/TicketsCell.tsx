import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { AdditionalUserData } from '@/entities/Team';

interface TicketsCellProps {
  tickets: AdditionalUserData['tickets'];
  absence?: AdditionalUserData['absence'];
}

export const TicketsCell = memo((props: TicketsCellProps) => {
  const { tickets, absence } = props;

  return (
    Boolean(tickets) && (
      <Tooltip title={'Назначенные тикеты'}>
        <Chip
          label={StateLabel(tickets, absence?.isAbsence)}
          variant={'outlined'}
          size={'small'}
          color={
            absence?.isAbsence
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

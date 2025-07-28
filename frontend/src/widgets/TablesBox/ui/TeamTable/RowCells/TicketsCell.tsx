import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { AdditionalUserData } from '@/entities/Team';
import { generateTicketsUrl } from './urlUtils';

interface TicketsCellProps {
  tickets: AdditionalUserData['tickets'];
  absence?: AdditionalUserData['absence'];
  idInside?: number;
}

export const TicketsCell = memo((props: TicketsCellProps) => {
  const { tickets, absence, idInside } = props;

  const handleClick = () => {
    if (idInside && tickets && tickets > 0) {
      const url = generateTicketsUrl(idInside);
      window.open(url, '_blank');
    }
  };

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
          onClick={handleClick}
          sx={{
            cursor: idInside && tickets > 0 ? 'pointer' : 'default',
            '&:hover':
              idInside && tickets > 0
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

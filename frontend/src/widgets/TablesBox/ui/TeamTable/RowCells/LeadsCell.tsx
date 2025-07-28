import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { AdditionalUserData } from '@/entities/Team';
import { StateLabel } from './StateLabel';
import { generateLeadsUrl } from './urlUtils';

interface LeadsCellProps {
  leads: AdditionalUserData['leads'];
  absence?: AdditionalUserData['absence'];
  idAmoCRM?: number;
}

export const LeadsCell = memo((props: LeadsCellProps) => {
  const { leads, absence, idAmoCRM } = props;

  const handleClick = () => {
    if (idAmoCRM && leads && leads > 0) {
      const url = generateLeadsUrl(idAmoCRM);
      window.open(url, '_blank');
    }
  };

  return (
    Boolean(leads) && (
      <Tooltip title={'Первичные обращения'}>
        <Chip
          label={StateLabel(leads, absence?.isAbsence)}
          variant={'outlined'}
          size={'small'}
          color={absence?.isAbsence ? 'default' : leads >= 5 ? 'error' : leads === 0 ? 'success' : 'primary'}
          onClick={handleClick}
          sx={{
            cursor: idAmoCRM && leads > 0 ? 'pointer' : 'default',
            '&:hover':
              idAmoCRM && leads > 0
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

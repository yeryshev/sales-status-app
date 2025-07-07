import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { AdditionalUserData } from '@/entities/Team';
import { StateLabel } from './StateLabel';

interface LeadsCellProps {
  leads: AdditionalUserData['leads'];
  absence?: AdditionalUserData['absence'];
}

export const LeadsCell = memo((props: LeadsCellProps) => {
  const { leads, absence } = props;

  return (
    Boolean(leads) && (
      <Tooltip title={'Первичные обращения'}>
        <Chip
          label={StateLabel(leads, absence?.isAbsence)}
          variant={'outlined'}
          size={'small'}
          color={absence?.isAbsence ? 'default' : leads >= 5 ? 'error' : leads === 0 ? 'success' : 'primary'}
        ></Chip>
      </Tooltip>
    )
  );
});

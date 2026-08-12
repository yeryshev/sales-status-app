import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { AdditionalUserData } from '@/entities/Team';
import { StateLabel } from './StateLabel';
import { generateLeadsSourceLostUrl } from './urlUtils';
import { hasLeadsSourceLost } from '../../../lib/teamDataHelpers';

interface LeadsSourceLostCellProps {
  leadsSourceLost: AdditionalUserData['leadsSourceLost'];
  absence?: AdditionalUserData['absence'];
  idAmoCRM?: number;
}

export const LeadsSourceLostCell = memo((props: LeadsSourceLostCellProps) => {
  const { leadsSourceLost, absence, idAmoCRM } = props;
  const count = leadsSourceLost ?? 0;
  const isClickable = Boolean(idAmoCRM) && hasLeadsSourceLost(leadsSourceLost);

  const handleClick = () => {
    if (!isClickable || !idAmoCRM) return;
    window.open(generateLeadsSourceLostUrl(idAmoCRM), '_blank');
  };

  return (
    hasLeadsSourceLost(leadsSourceLost) && (
      <Tooltip title={'Сделки без источника'}>
        <Chip
          label={StateLabel(count, absence?.isAbsence)}
          variant={'outlined'}
          size={'small'}
          color={absence?.isAbsence ? 'default' : 'error'}
          onClick={handleClick}
          sx={{
            cursor: isClickable ? 'pointer' : 'default',
            '&:hover': isClickable
              ? {
                  opacity: 0.8,
                  transform: 'scale(1.02)',
                }
              : {},
          }}
        />
      </Tooltip>
    )
  );
});

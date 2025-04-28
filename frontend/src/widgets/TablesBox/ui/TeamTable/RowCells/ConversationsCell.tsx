import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { AdditionalUserData } from '@/entities/Team';

interface ConversationsCellProps {
  conversations: AdditionalUserData['conversations'];
  absence?: AdditionalUserData['absence'];
}

export const ConversationsCell = memo((props: ConversationsCellProps) => {
  const { conversations, absence } = props;

  return (
    Boolean(conversations) && (
      <Tooltip title={'Количество открытых чатов'}>
        <Chip
          label={StateLabel(conversations, absence?.isAbsence)}
          variant={'outlined'}
          size={'small'}
          color={absence?.isAbsence ? 'default' : conversations === 0 ? 'success' : 'primary'}
        ></Chip>
      </Tooltip>
    )
  );
});

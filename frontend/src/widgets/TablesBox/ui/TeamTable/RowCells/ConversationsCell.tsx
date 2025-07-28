import { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import { StateLabel } from './StateLabel';
import { AdditionalUserData } from '@/entities/Team';
import { generateConversationsUrl } from './urlUtils';

interface ConversationsCellProps {
  conversations: AdditionalUserData['conversations'];
  absence?: AdditionalUserData['absence'];
}

export const ConversationsCell = memo((props: ConversationsCellProps) => {
  const { conversations, absence } = props;

  const handleClick = () => {
    if (conversations && conversations > 0) {
      const url = generateConversationsUrl();
      window.open(url, '_blank');
    }
  };

  return (
    Boolean(conversations) && (
      <Tooltip title={'Количество открытых чатов'}>
        <Chip
          label={StateLabel(conversations, absence?.isAbsence)}
          variant={'outlined'}
          size={'small'}
          color={absence?.isAbsence ? 'default' : conversations === 0 ? 'success' : 'primary'}
          onClick={handleClick}
          sx={{
            cursor: conversations > 0 ? 'pointer' : 'default',
            '&:hover':
              conversations > 0
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

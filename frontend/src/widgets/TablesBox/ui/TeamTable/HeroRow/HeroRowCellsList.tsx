import { ChangeEvent } from 'react';
import { Skeleton, Switch } from '@mui/material';
import { StatusSelector } from '@/features/StatusSelector';
import { AvatarCell } from '../RowCells/AvatarCell';
import { UserNameCell } from '../RowCells/UserNameCell';
import { LeadsCell } from '../RowCells/LeadsCell';
import { TasksCell } from '../RowCells/TasksCell';
import { ConversationsCell } from '../RowCells/ConversationsCell';
import { TicketsCell } from '../RowCells/TicketsCell';
import { TeamRowCell } from '../TeamRow/TeamRowCellsList';
import { HeroRowProps } from './HeroRow';
import { CommentCell } from './CommentCell';

interface TeamRowCellsListProps extends HeroRowProps {
  handleSwitch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const HeroRowCellsList = (props: TeamRowCellsListProps): TeamRowCell[] => {
  const {
    teammate,
    tasks,
    tickets,
    teamIsLoading,
    avatarsAndBirthday,
    isDeadlineReached,
    isAccountManagersRoute,
    handleSwitch,
  } = props;

  return [
    {
      align: 'left',
      width: 50,
      content: <AvatarCell teammate={teammate} avatarsAndBirthday={avatarsAndBirthday} />,
    },
    {
      align: 'left',
      width: 160,
      content: <UserNameCell teammate={teammate} />,
    },
    {
      align: 'left',
      width: 160,
      content: teamIsLoading ? <Skeleton variant="text" /> : !isAccountManagersRoute && <StatusSelector />,
    },
    {
      align: 'left',
      content: <CommentCell teammate={teammate} teamIsLoading={teamIsLoading} isDeadlineReached={isDeadlineReached} />,
    },
    {
      align: 'center',
      width: 60,
      content: <LeadsCell teamIsLoading={teamIsLoading} tasks={tasks} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TasksCell teamIsLoading={teamIsLoading} tasks={tasks} />,
    },
    {
      align: 'center',
      width: 60,
      content: <ConversationsCell teamIsLoading={teamIsLoading} tasks={tasks} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TicketsCell tickets={tickets} teamIsLoading={teamIsLoading} />,
    },
    {
      align: 'center',
      width: 72,
      content: !isAccountManagersRoute && (
        <Switch name="isWorkingRemotely" checked={teammate.isWorkingRemotely} size={'small'} onChange={handleSwitch} />
      ),
    },
  ];
};

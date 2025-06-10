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
import { DealsCell } from '../RowCells/DealsCell';
import { BudgetCell } from '../RowCells/BudgetCell';
import { QlikCell } from '../RowCells/QlikCell';
import { CommentCell } from './CommentCell';

interface TeamRowCellsListProps extends HeroRowProps {
  handleSwitch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const HeroRowCellsList = (props: TeamRowCellsListProps): TeamRowCell[] => {
  const { teammate, teamIsLoading, additionalUserData, isDeadlineReached, isAccountManagersRoute, handleSwitch } =
    props;

  const { avatar, deals, budget, qlik, leads, overdueTasks, conversations, tickets } = additionalUserData ?? {};

  return [
    {
      align: 'left',
      width: 50,
      content: <AvatarCell teammate={teammate} avatar={avatar} />,
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
      width: 250,
      content: <CommentCell teammate={teammate} teamIsLoading={teamIsLoading} isDeadlineReached={isDeadlineReached} />,
    },
    {
      align: 'left',
      width: 120,
      content: <QlikCell qlik={qlik} teammate={teammate} />,
    },
    {
      align: 'center',
      width: 60,
      content: <DealsCell deals={deals} teammate={teammate} />,
    },
    {
      align: 'left',
      content: <BudgetCell budget={budget} teammate={teammate} />,
    },
    {
      align: 'center',
      width: 60,
      content: <LeadsCell leads={leads} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TasksCell overdueTasks={overdueTasks} />,
    },
    {
      align: 'center',
      width: 60,
      content: <ConversationsCell conversations={conversations} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TicketsCell tickets={tickets} />,
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

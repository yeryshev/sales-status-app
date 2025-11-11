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
import { QlikCell } from '../RowCells/QlikCell';
import { AmoCrmCell } from '../RowCells/AmoCrmCell';
import { CommentCell } from './CommentCell';
import { CELL_WIDTHS } from '../constants';

interface TeamRowCellsListProps extends HeroRowProps {
  handleSwitch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const HeroRowCellsList = (props: TeamRowCellsListProps): TeamRowCell[] => {
  const { teammate, teamIsLoading, additionalUserData, isDeadlineReached, isAccountManagersRoute, handleSwitch } =
    props;

  const { avatar, deals, budget, qlik, leads, overdueTasks, conversations, tickets, idAmoCRM, idInside } =
    additionalUserData ?? {};

  return [
    {
      align: 'left',
      width: CELL_WIDTHS.AVATAR,
      content: <AvatarCell teammate={teammate} avatar={avatar} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.USER_NAME,
      content: <UserNameCell teammate={teammate} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.STATUS,
      content: teamIsLoading ? <Skeleton variant="text" /> : <StatusSelector />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.COMMENT,
      content: <CommentCell teammate={teammate} teamIsLoading={teamIsLoading} isDeadlineReached={isDeadlineReached} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.QLIK,
      content: <QlikCell qlik={qlik} teammate={teammate} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.AMO_CRM,
      content: <AmoCrmCell budget={budget} deals={deals} teammate={teammate} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.LEADS,
      content: <LeadsCell leads={leads} idAmoCRM={idAmoCRM} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.TASKS,
      content: <TasksCell overdueTasks={overdueTasks} idAmoCRM={idAmoCRM} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.CONVERSATIONS,
      content: <ConversationsCell conversations={conversations} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.TICKETS,
      content: <TicketsCell tickets={tickets} idInside={idInside} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.ARROW_DOWN,
      content: !isAccountManagersRoute && (
        <Switch
          id="is-working-remotely-switch"
          name="isWorkingRemotely"
          checked={teammate.isWorkingRemotely}
          size={'small'}
          onChange={handleSwitch}
        />
      ),
    },
  ];
};

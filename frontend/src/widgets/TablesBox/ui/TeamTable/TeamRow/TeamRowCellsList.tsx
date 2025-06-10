import { TableCellProps } from '@mui/material';
import { TeamRowProps } from './TeamRow';
import { ReactNode, TdHTMLAttributes } from 'react';
import { AvatarCell } from '../RowCells/AvatarCell';
import { UserNameCell } from '../RowCells/UserNameCell';
import { StatusCell } from '../RowCells/StatusCell';
import { CommentCell } from '../RowCells/CommentCell';
import { LeadsCell } from '../RowCells/LeadsCell';
import { TasksCell } from '../RowCells/TasksCell';
import { TicketsCell } from '../RowCells/TicketsCell';
import { ArrowDownCell } from '../RowCells/ArrowDownCell';
import { ConversationsCell } from '../RowCells/ConversationsCell';
import { DealsCell } from '../RowCells/DealsCell';
import { BudgetCell } from '../RowCells/BudgetCell';
import { QlikCell } from '../RowCells/QlikCell';

export interface TeamRowCell {
  align: TableCellProps['align'];
  width?: TdHTMLAttributes<HTMLTableCellElement>['width'];
  content: ReactNode;
}

interface TeamRowCellsListProps extends TeamRowProps {
  expandRow: boolean;
  setExpandRow: (value: boolean) => void;
}

export const TeamRowCellsList = (props: TeamRowCellsListProps): TeamRowCell[] => {
  const { teammate, additionalUserData, isDeadlineReached, isAccountManagersRoute, expandRow, setExpandRow } = props;

  const { avatar, absence, mangoState, deals, budget, qlik, leads, overdueTasks, conversations, tickets } =
    additionalUserData;

  return [
    {
      align: 'left',
      width: 50,
      content: <AvatarCell teammate={teammate} avatar={avatar} absence={absence} />,
    },
    {
      align: 'left',
      width: 160,
      content: <UserNameCell teammate={teammate} absence={absence} />,
    },
    {
      align: 'left',
      width: 160,
      content: !isAccountManagersRoute && (
        <StatusCell teammate={teammate} mango={mangoState} absence={absence} isDeadlineReached={isDeadlineReached} />
      ),
    },
    {
      align: 'left',
      width: 250,
      content: <CommentCell absence={absence} />,
    },
    {
      align: 'left',
      width: 120,
      content: <QlikCell qlik={qlik} teammate={teammate} absence={absence} />,
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
      content: <LeadsCell leads={leads} absence={absence} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TasksCell overdueTasks={overdueTasks} absence={absence} />,
    },
    {
      align: 'center',
      width: 60,
      content: <ConversationsCell conversations={conversations} absence={absence} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TicketsCell tickets={tickets} absence={absence} />,
    },
    {
      align: 'center',
      width: 72,
      content: <ArrowDownCell expandRow={expandRow} setExpandRow={setExpandRow} />,
    },
  ];
};

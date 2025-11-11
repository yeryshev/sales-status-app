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
import { QlikCell } from '../RowCells/QlikCell';
import { AmoCrmCell } from '../RowCells/AmoCrmCell';
import { CELL_WIDTHS } from '../constants';

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
  const { teammate, additionalUserData, isDeadlineReached, expandRow, setExpandRow } = props;

  const {
    avatar,
    absence,
    mangoState,
    deals,
    budget,
    qlik,
    leads,
    overdueTasks,
    conversations,
    tickets,
    idAmoCRM,
    idInside,
  } = additionalUserData;

  return [
    {
      align: 'left',
      width: CELL_WIDTHS.AVATAR,
      content: <AvatarCell teammate={teammate} avatar={avatar} absence={absence} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.USER_NAME,
      content: <UserNameCell teammate={teammate} absence={absence} />,
    },
    {
      align: 'left',
      width: CELL_WIDTHS.STATUS,
      content: (
        <StatusCell teammate={teammate} mango={mangoState} absence={absence} isDeadlineReached={isDeadlineReached} />
      ),
    },
    {
      align: 'left',
      width: CELL_WIDTHS.COMMENT,
      content: <CommentCell absence={absence} />,
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
      content: <LeadsCell leads={leads} absence={absence} idAmoCRM={idAmoCRM} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.TASKS,
      content: <TasksCell overdueTasks={overdueTasks} absence={absence} idAmoCRM={idAmoCRM} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.CONVERSATIONS,
      content: <ConversationsCell conversations={conversations} absence={absence} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.TICKETS,
      content: <TicketsCell tickets={tickets} absence={absence} idInside={idInside} />,
    },
    {
      align: 'center',
      width: CELL_WIDTHS.ARROW_DOWN,
      content: <ArrowDownCell expandRow={expandRow} setExpandRow={setExpandRow} />,
    },
  ];
};

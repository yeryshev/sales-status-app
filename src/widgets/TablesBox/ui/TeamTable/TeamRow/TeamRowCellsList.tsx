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
  const {
    teammate,
    mango,
    tasks,
    tickets,
    vacationState,
    teamIsLoading,
    avatarsAndBirthday,
    isDeadlineReached,
    isAccountManagersRoute,
    expandRow,
    setExpandRow,
  } = props;

  return [
    {
      align: 'left',
      width: 50,
      content: <AvatarCell teammate={teammate} avatarsAndBirthday={avatarsAndBirthday} vacationState={vacationState} />,
    },
    {
      align: 'left',
      width: 160,
      content: <UserNameCell teammate={teammate} vacationState={vacationState} />,
    },
    {
      align: 'left',
      width: 160,
      content: !isAccountManagersRoute && (
        <StatusCell
          teammate={teammate}
          mango={mango}
          vacationState={vacationState}
          isDeadlineReached={isDeadlineReached}
        />
      ),
    },
    {
      align: 'left',
      content: <CommentCell vacationState={vacationState} />,
    },
    {
      align: 'center',
      width: 60,
      content: <LeadsCell teamIsLoading={teamIsLoading} tasks={tasks} vacationState={vacationState} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TasksCell teamIsLoading={teamIsLoading} tasks={tasks} vacationState={vacationState} />,
    },
    {
      align: 'center',
      width: 60,
      content: <ConversationsCell teamIsLoading={teamIsLoading} tasks={tasks} vacationState={vacationState} />,
    },
    {
      align: 'center',
      width: 60,
      content: <TicketsCell tickets={tickets} vacationState={vacationState} teamIsLoading={teamIsLoading} />,
    },
    {
      align: 'center',
      width: 72,
      content: <ArrowDownCell expandRow={expandRow} setExpandRow={setExpandRow} />,
    },
  ];
};

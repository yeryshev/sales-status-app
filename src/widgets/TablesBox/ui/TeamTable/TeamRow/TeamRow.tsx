import { memo, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Teammate, UserAvatarsAndBirthday, UserTasks, UserTickets, UserVacation } from '@/entities/Team';
import { TeamRowCellsList } from './TeamRowCellsList';
import { ExpandRow } from '../RowCells/ExpandRow';

export interface TeamRowProps {
  teammate: Teammate;
  mango: boolean;
  tasks: UserTasks;
  tickets: UserTickets;
  vacationState: UserVacation | undefined;
  avatarsAndBirthday: UserAvatarsAndBirthday;
  teamIsLoading: boolean;
  isDeadlineReached: boolean;
  isAccountManagersRoute: boolean;
}

export const TeamRow = memo((props: TeamRowProps) => {
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
  } = props;
  const [expandRow, setExpandRow] = useState(false);

  const exampleProps = {
    teammate,
    mango,
    tasks,
    tickets,
    vacationState,
    avatarsAndBirthday,
    teamIsLoading,
    isDeadlineReached,
    isAccountManagersRoute,
    expandRow,
    setExpandRow,
  };

  const teamRowCells = TeamRowCellsList(exampleProps);

  return (
    <>
      <TableRow hover={true}>
        {teamRowCells.map((cell, index) => (
          <TableCell key={index} align={cell.align} width={cell.width}>
            {cell.content}
          </TableCell>
        ))}
      </TableRow>
      <ExpandRow teammate={teammate} expandRow={expandRow} />
    </>
  );
});

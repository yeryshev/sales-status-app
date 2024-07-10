import { type ChangeEvent, memo, useCallback } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import { Teammate } from '@/entities/Team/model/types/teammate';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { UserAvatarsAndBirthday, UserTasks, UserTickets } from '@/entities/Team/model/types/tasksWebsocket';
import { getUserData } from '@/entities/User';
import { HeroRowCellsList } from './HeroRowCellsList';

export interface HeroRowProps {
  teammate: Teammate;
  tasks: UserTasks;
  tickets: UserTickets;
  avatarsAndBirthday: UserAvatarsAndBirthday;
  teamIsLoading: boolean;
  isDeadlineReached: boolean;
  isAccountManagersRoute: boolean;
}

export const HeroRow = memo((props: HeroRowProps) => {
  const { teammate, tasks, tickets, teamIsLoading, avatarsAndBirthday, isDeadlineReached, isAccountManagersRoute } =
    props;
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();

  const handleSwitch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      user && dispatch(updateUser({ user: { ...user, isWorkingRemotely: e.target.checked } }));
    },
    [dispatch, user],
  );

  const heroRowProps = {
    teammate,
    tasks,
    tickets,
    teamIsLoading,
    avatarsAndBirthday,
    isDeadlineReached,
    isAccountManagersRoute,
    handleSwitch,
  };

  const heroRowCells = HeroRowCellsList(heroRowProps);

  return (
    <TableRow hover={false}>
      {heroRowCells.map((cell, index) => (
        <TableCell key={index} align={cell.align} width={cell.width}>
          {cell.content}
        </TableCell>
      ))}
    </TableRow>
  );
});

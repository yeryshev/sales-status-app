import { type ChangeEvent, memo, useCallback } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Teammate, UserAvatarsAndBirthday, UserTasks, UserTickets } from '@/entities/Team';
import { checkUser, updateUser, userActions } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
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
  const dispatch = useAppDispatch();

  const handleSwitch = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const dataToUpdate = { ...teammate, isWorkingRemotely: e.target.checked };
      dispatch(userActions.setUserData(dataToUpdate));
      const { payload: updatedUser } = await dispatch(updateUser({ user: dataToUpdate }));
      if (!updatedUser) dispatch(checkUser());
    },
    [dispatch, teammate],
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

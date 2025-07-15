import { type ChangeEvent, memo, useCallback } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { AdditionalUserData } from '@/entities/Team';
import { User } from '@/entities/User';
import { checkUser, updateUser, userActions } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { CustomerCareHeroRowCellsList } from './CustomerCareHeroRowCellsList';

export interface CustomerCareHeroRowProps {
  teammate: User;
  teamIsLoading: boolean;
  additionalUserData: AdditionalUserData;
  isDeadlineReached: boolean;
}

export const CustomerCareHeroRow = memo((props: CustomerCareHeroRowProps) => {
  const { teammate, teamIsLoading, additionalUserData, isDeadlineReached } = props;
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
    teamIsLoading,
    additionalUserData,
    isDeadlineReached,
    handleSwitch,
    isAccountManagersRoute: false,
  };

  const heroRowCells = CustomerCareHeroRowCellsList(heroRowProps);

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

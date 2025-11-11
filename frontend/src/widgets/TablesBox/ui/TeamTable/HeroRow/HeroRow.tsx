import { type ChangeEvent, memo, useCallback, useRef } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { AdditionalUserData } from '@/entities/Team';
import { User } from '@/entities/User';
import { checkUser, updateUser, userActions } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { logger } from '@/shared/lib/utils/logger';
import { HeroRowCellsList } from './HeroRowCellsList';

export interface HeroRowProps {
  teammate: User;
  teamIsLoading: boolean;
  additionalUserData: AdditionalUserData;
  isDeadlineReached: boolean;
  isAccountManagersRoute: boolean;
}

export const HeroRow = memo((props: HeroRowProps) => {
  const { teammate, teamIsLoading, additionalUserData, isDeadlineReached, isAccountManagersRoute } = props;
  const dispatch = useAppDispatch();
  const isUpdatingRef = useRef(false);

  const handleSwitch = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;

      // Предотвращаем множественные клики
      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      try {
        const dataToUpdate = { ...teammate, isWorkingRemotely: newValue };

        // Оптимистичное обновление UI
        dispatch(userActions.setUserData(dataToUpdate));

        // Отправляем запрос на сервер
        const { payload: updatedUser } = await dispatch(updateUser({ user: dataToUpdate }));

        if (!updatedUser) {
          // Если запрос не удался, восстанавливаем предыдущее состояние
          dispatch(userActions.setUserData(teammate));
          dispatch(checkUser());
        }
      } catch (error) {
        // В случае ошибки восстанавливаем предыдущее состояние
        logger.error('Error updating user:', error);
        dispatch(userActions.setUserData(teammate));
        dispatch(checkUser());
      } finally {
        isUpdatingRef.current = false;
      }
    },
    [dispatch, teammate],
  );

  const heroRowProps = {
    teammate,
    teamIsLoading,
    additionalUserData,
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

import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { fetchTeamList, useGetAdditionalTeamData } from '@/entities/Team';
import { checkUser } from '@/entities/User';
import { useGetStatuses } from '@/entities/Status';
import { useGetTgChats } from '@/widgets/ChatsTable';

/**
 * Хук для автоматического обновления всех данных при восстановлении соединения
 */
export const useDataRefresh = () => {
  const dispatch = useAppDispatch();

  // RTK Query хуки для получения функций refetch
  const { refetch: refetchStatuses } = useGetStatuses();

  const { refetch: refetchTgChats } = useGetTgChats(undefined, {
    skip: !import.meta.env.VITE_API_URL,
  });

  const { refetch: refetchTeamData } = useGetAdditionalTeamData(undefined, {
    skip: !import.meta.env.VITE_NEW_API_URL,
  });

  const refreshAllData = useCallback(async () => {
    console.log('🔄 Refreshing all data after connection restore...');

    try {
      // Обновляем данные из VITE_BACKEND_URL
      await Promise.all([
        dispatch(fetchTeamList()), // Список команды
        dispatch(checkUser()), // Данные текущего пользователя
        refetchStatuses(), // Статусы через RTK Query
      ]);

      // Обновляем RTK Query данные из внешних API
      const refreshPromises = [];

      if (import.meta.env.VITE_API_URL) {
        refreshPromises.push(
          refetchTgChats(), // Telegram чаты
        );
      }

      if (import.meta.env.VITE_NEW_API_URL) {
        refreshPromises.push(
          refetchTeamData(), // Дополнительные данные о команде
        );
      }

      await Promise.all(refreshPromises);

      console.log('✅ All data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
    }
  }, [dispatch, refetchStatuses, refetchTgChats, refetchTeamData]);

  return { refreshAllData };
};

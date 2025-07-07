import { useCallback } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { fetchTeamList, useGetAdditionalTeamData } from '@/entities/Team';
import { checkUser } from '@/entities/User';
import { useGetStatuses } from '@/entities/Status';
import { useGetTgChats } from '@/widgets/ChatsTable';
import { logger } from '../utils/logger';

/**
 * Хук для автоматического обновления всех данных при восстановлении соединения
 */
export const useDataRefresh = () => {
  const dispatch = useAppDispatch();

  // RTK Query хуки для получения функций refetch
  const { refetch: refetchStatuses } = useGetStatuses();

  const { refetch: refetchTgChats } = useGetTgChats(undefined, {
    skip: !import.meta.env.VITE_EXTERNAL_API_URL,
  });

  const { refetch: refetchTeamData } = useGetAdditionalTeamData(undefined, {
    skip: !import.meta.env.VITE_EXTERNAL_API_URL,
  });

  const refreshAllData = useCallback(async () => {
    logger.log('🔄 Refreshing all data after connection restore...');

    try {
      // Обновляем данные из VITE_BACKEND_URL
      await Promise.all([
        dispatch(fetchTeamList()), // Список команды
        dispatch(checkUser()), // Данные текущего пользователя
        refetchStatuses(), // Статусы через RTK Query
      ]);

      // Обновляем RTK Query данные из внешних API
      const refreshPromises = [];

      if (import.meta.env.VITE_EXTERNAL_API_URL) {
        refreshPromises.push(
          refetchTgChats(), // Telegram чаты
          refetchTeamData(), // Дополнительные данные о команде
        );
      }

      await Promise.all(refreshPromises);

      logger.log('✅ All data refreshed successfully');
    } catch (error) {
      logger.error('❌ Error refreshing data:', error);
    }
  }, [dispatch, refetchStatuses, refetchTgChats, refetchTeamData]);

  return { refreshAllData };
};

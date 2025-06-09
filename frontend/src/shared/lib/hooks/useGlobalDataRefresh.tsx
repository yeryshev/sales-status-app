import { useCallback, useRef } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { fetchTeamList } from '@/entities/Team';
import { checkUser } from '@/entities/User';

/**
 * Глобальный хук для обновления данных после восстановления соединения.
 * Может использоваться из любого места приложения.
 */
export const useGlobalDataRefresh = () => {
  const dispatch = useAppDispatch();
  const isRefreshingRef = useRef(false);

  const refreshGlobalData = useCallback(async () => {
    // Предотвращаем множественные одновременные обновления
    if (isRefreshingRef.current) {
      console.log('⏭️ Data refresh already in progress, skipping...');
      return;
    }

    isRefreshingRef.current = true;
    console.log('🔄 Refreshing global data after connection restore...');

    try {
      // Обновляем основные данные из VITE_BACKEND_URL
      await Promise.all([
        dispatch(fetchTeamList()), // Список команды
        dispatch(checkUser()), // Данные текущего пользователя
      ]);

      console.log('✅ Global data refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing global data:', error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [dispatch]);

  return { refreshGlobalData };
};

// Глобальная функция для вызова обновления данных из любого места
let globalRefreshFunction: (() => Promise<void>) | null = null;

export const setGlobalRefreshFunction = (refreshFn: () => Promise<void>) => {
  globalRefreshFunction = refreshFn;
};

export const triggerGlobalDataRefresh = async () => {
  if (globalRefreshFunction) {
    await globalRefreshFunction();
  } else {
    console.warn('⚠️ Global refresh function not set');
  }
};

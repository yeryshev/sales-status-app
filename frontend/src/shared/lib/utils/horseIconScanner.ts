// Утилита для динамического сканирования иконок лошадей
import { baseHorseIcons, specialHorseIcons } from '@/shared/assets/icons/horses';

// Базовые иконки (всегда доступны)
export const BASE_ICONS = {
  first: 'first.png',
  last: 'last.png',
  regular1: 'regular1.png',
  regular2: 'regular2.png',
  regular3: 'regular3.png',
  regular4: 'regular4.png',
  regular5: 'regular5.png',
};

// Функция для получения всех доступных иконок
export const getAllHorseIcons = () => {
  return {
    ...baseHorseIcons,
    // Здесь можно добавить логику для динамического сканирования папки
    // Пока используем статический список
  };
};

// Функция для получения специальных иконок по ID
export const getSpecialIconsByPattern = () => {
  // Возвращаем только те ID, для которых есть реальные файлы
  const availableIds: Record<number, string> = {};

  Object.keys(specialHorseIcons).forEach((key) => {
    const id = parseInt(key);
    if (!isNaN(id)) {
      // Проверяем, что иконка не является fallback (regular)
      const iconPath = specialHorseIcons[id as keyof typeof specialHorseIcons];
      if (iconPath && !iconPath.includes('regular')) {
        availableIds[id] = `${id}.png`;
      }
    }
  });

  return availableIds;
};

// Функция для определения variant на основе ID и позиции
export const getHorseIconVariant = (insideId: number, position: number, totalHorses: number): number => {
  // Приоритет 1: По позиции (first/last)
  if (position === 0) {
    return 0; // first.png
  }
  if (position === totalHorses - 1) {
    return 5; // last.png
  }

  // Приоритет 2: По специальным иконкам
  const specialIcons = getSpecialIconsByPattern();
  const availableSpecialIds = Object.keys(specialIcons).map(Number);

  if (availableSpecialIds.includes(insideId)) {
    const specialIndex = availableSpecialIds.indexOf(insideId);
    return 6 + specialIndex; // После базовых иконок
  }

  // Приоритет 3: Regular иконки
  return (position % 4) + 1;
};

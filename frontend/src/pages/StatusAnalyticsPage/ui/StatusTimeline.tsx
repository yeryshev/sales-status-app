import { memo, useMemo } from 'react';
import { Box, Typography, Paper, Tooltip, Chip } from '@mui/material';
import { useAppSelector } from '@/shared/lib/hooks';
import { getStatusHistory, getStatusAnalyticsFilters } from '@/entities/StatusAnalytics';

// Цвета для разных статусов
const STATUS_COLORS: Record<number, string> = {
  1: '#4caf50', // работаю - зеленый
  2: '#ff9800', // занят - оранжевый
  3: '#f44336', // оффлайн - красный
  5: '#2196f3', // обед - синий
  6: '#9c27b0', // отошёл - фиолетовый
  7: '#00bcd4', // встреча - голубой
};

const STATUS_NAMES: Record<number, string> = {
  1: 'работаю',
  2: 'занят',
  3: 'оффлайн',
  5: 'обед',
  6: 'отошёл',
  7: 'встреча',
};

interface TimelineSegment {
  statusId: number;
  statusName: string;
  color: string;
  startTime: string;
  endTime: string | null;
  duration: number; // в секундах
  width: number; // в процентах
}

export const StatusTimeline = memo(() => {
  const history = useAppSelector(getStatusHistory);
  const filters = useAppSelector(getStatusAnalyticsFilters);

  const timelineData = useMemo(() => {
    if (!filters.userId || filters.periodType !== 'day') {
      return null;
    }

    // Получаем всю историю пользователя (не только за выбранный день)
    const userHistory = history.filter((record: { userId: number }) => record.userId === filters.userId);

    if (userHistory.length === 0) {
      return null;
    }

    // Сортируем по времени начала
    const sortedHistory = [...userHistory].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    // Вычисляем общую продолжительность дня в Московском времени
    // Создаем даты в Московском времени для отображения
    const moscowDayStart = new Date(filters.startDate + 'T00:00:00+03:00'); // 00:00 по Москве
    const moscowDayEnd = new Date(filters.startDate + 'T23:59:59+03:00'); // 23:59 по Москве

    // Для сравнения с данными из БД используем UTC даты (вычитаем 3 часа от московского времени)
    const dayStart = new Date(moscowDayStart.getTime() - 3 * 60 * 60 * 1000); // UTC начало дня
    const dayEnd = new Date(moscowDayEnd.getTime() - 3 * 60 * 60 * 1000); // UTC конец дня
    const totalDayDuration = (dayEnd.getTime() - dayStart.getTime()) / 1000; // в секундах

    // Находим записи, которые пересекаются с выбранным днем
    const dayRecords = sortedHistory.filter((record) => {
      const recordStart = new Date(record.startTime);
      const recordEnd = record.endTime ? new Date(record.endTime) : new Date();

      // Запись пересекается с днем, если:
      // 1. Началась в этот день ИЛИ
      // 2. Началась до этого дня, но не закончилась (продолжается в этот день) ИЛИ
      // 3. Началась до этого дня, но закончилась в этот день или позже
      return (
        (recordStart >= dayStart && recordStart <= dayEnd) ||
        (recordStart < dayStart && (!record.endTime || recordEnd >= dayStart))
      );
    });

    // Создаем сегменты таймлайна
    const segments: TimelineSegment[] = [];
    let currentTime = dayStart;

    for (const record of dayRecords) {
      const startTime = new Date(record.startTime);
      const isActiveStatus = !record.endTime; // Статус активен, если нет end_time

      // Для активных статусов используем текущее время UTC, для завершенных - end_time
      const endTime = record.endTime ? new Date(record.endTime) : new Date();

      // Корректируем время начала и окончания для отображения в рамках дня
      const segmentStart = startTime < dayStart ? dayStart : startTime;
      // Для активных статусов используем текущее время, для завершенных - ограничиваем днем
      const segmentEnd = isActiveStatus ? endTime : endTime > dayEnd ? dayEnd : endTime;

      // Создаем даты для отображения в Московском времени
      // Добавляем 3 часа к UTC времени для отображения в московском времени
      const displayStart = new Date(segmentStart.getTime() + 3 * 60 * 60 * 1000);
      const displayEnd = new Date(segmentEnd.getTime() + 3 * 60 * 60 * 1000);

      // Добавляем промежуток до начала статуса (если есть)
      if (segmentStart > currentTime) {
        const gapDuration = (segmentStart.getTime() - currentTime.getTime()) / 1000;
        if (gapDuration > 60) {
          // Показываем только промежутки больше минуты
          const displayCurrentTime = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
          segments.push({
            statusId: 0,
            statusName: 'неактивен',
            color: '#e0e0e0',
            startTime: displayCurrentTime.toISOString(),
            endTime: displayStart.toISOString(),
            duration: gapDuration,
            width: (gapDuration / totalDayDuration) * 100,
          });
        }
      }

      // Добавляем сегмент статуса
      // Для активных статусов рассчитываем продолжительность от оригинального startTime до текущего времени (как в таблице)
      // Для завершенных статусов - от segmentStart до segmentEnd
      const duration = isActiveStatus
        ? (endTime.getTime() - startTime.getTime()) / 1000 - 3 * 60 * 60 // Убираем 3 часа разницы
        : (segmentEnd.getTime() - segmentStart.getTime()) / 1000;
      if (duration > 0) {
        const statusName = STATUS_NAMES[record.newStatusId] || `статус ${record.newStatusId}`;
        const baseColor = STATUS_COLORS[record.newStatusId] || '#757575';

        segments.push({
          statusId: record.newStatusId,
          statusName: isActiveStatus ? `${statusName} (текущий)` : statusName,
          color: isActiveStatus ? baseColor : baseColor, // Можно добавить специальный цвет для активных
          startTime: displayStart.toISOString(),
          endTime: displayEnd.toISOString(),
          duration,
          width: (duration / totalDayDuration) * 100,
        });
      }

      // Для активных статусов currentTime должен учитывать вычитание 3 часов
      currentTime = isActiveStatus ? new Date(segmentEnd.getTime() - 3 * 60 * 60 * 1000) : segmentEnd;
    }

    // Добавляем оставшееся время до конца дня (если есть)
    if (currentTime < dayEnd) {
      const remainingDuration = (dayEnd.getTime() - currentTime.getTime()) / 1000;
      if (remainingDuration > 60) {
        const displayCurrentTime = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
        const displayDayEnd = new Date(dayEnd.getTime() + 3 * 60 * 60 * 1000);

        // Определяем, есть ли активный статус (последний без end_time)
        const hasActiveStatus = dayRecords.some((record) => !record.endTime);

        segments.push({
          statusId: hasActiveStatus ? -1 : 0, // -1 для будущего времени, 0 для неактивен
          statusName: hasActiveStatus ? '' : 'неактивен', // Пустая строка для будущего времени
          color: hasActiveStatus ? '#f5f5f5' : '#e0e0e0', // Светло-серый для будущего времени
          startTime: displayCurrentTime.toISOString(),
          endTime: displayDayEnd.toISOString(),
          duration: remainingDuration,
          width: (remainingDuration / totalDayDuration) * 100,
        });
      }
    }

    return {
      segments,
      totalDuration: totalDayDuration,
      dayStart,
      dayEnd,
      moscowDayStart,
      moscowDayEnd,
    };
  }, [history, filters]);

  if (!timelineData) {
    return null;
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow', // Московское время
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Таймлайн статусов за день
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {formatTime(timelineData.moscowDayStart.toISOString())} -{' '}
          {formatTime(timelineData.moscowDayEnd.toISOString())}
        </Typography>
      </Box>

      {/* Таймлайн */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: 40,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          mb: 2,
        }}
      >
        {timelineData.segments.map((segment, index) => (
          <Tooltip
            key={index}
            title={
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {segment.statusName}
                </Typography>
                <Typography variant="body2">
                  {formatTime(segment.startTime)} -{' '}
                  {segment.statusName.includes('(текущий)')
                    ? 'текущий'
                    : segment.endTime
                      ? formatTime(segment.endTime)
                      : 'текущий'}
                </Typography>
                <Typography variant="body2">Продолжительность: {formatDuration(segment.duration)}</Typography>
              </Box>
            }
            arrow
          >
            <Box
              sx={{
                width: `${segment.width}%`,
                height: '100%',
                backgroundColor: segment.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.8,
                },
                borderRight: index < timelineData.segments.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                // Специальные стили для разных типов сегментов
                ...(segment.statusId === -1 && {
                  // Будущее время - пунктирная граница
                  border: '2px dashed #ccc',
                  backgroundColor: 'transparent',
                }),
                ...(segment.statusName.includes('(текущий)') && {
                  // Текущий статус - более яркий цвет и анимация
                  filter: 'brightness(1.1)',
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.3)',
                }),
              }}
            ></Box>
          </Tooltip>
        ))}
      </Box>

      {/* Легенда */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Array.from(new Set(timelineData.segments.map((s) => s.statusId)))
          .filter((statusId) => statusId !== -1) // Исключаем сегмент "будущее время" (statusId = -1)
          .map((statusId) => {
            const segment = timelineData.segments.find((s) => s.statusId === statusId);
            if (!segment) return null;

            const totalDuration = timelineData.segments
              .filter((s) => s.statusId === statusId)
              .reduce((sum, s) => sum + s.duration, 0);

            return (
              <Chip
                key={statusId}
                label={`${segment.statusName} (${formatDuration(totalDuration)})`}
                size="small"
                sx={{
                  backgroundColor: segment.color,
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            );
          })}
      </Box>
    </Paper>
  );
});

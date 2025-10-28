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

    // Фильтруем историю для выбранного пользователя и дня
    const userHistory = history.filter(
      (record: { userId: number; startTime: string }) =>
        record.userId === filters.userId && record.startTime.startsWith(filters.startDate),
    );

    if (userHistory.length === 0) {
      return null;
    }

    // Сортируем по времени начала
    const sortedHistory = [...userHistory].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    // Вычисляем общую продолжительность дня
    const dayStart = new Date(filters.startDate + 'T00:00:00');
    const dayEnd = new Date(filters.startDate + 'T23:59:59');
    const totalDayDuration = (dayEnd.getTime() - dayStart.getTime()) / 1000; // в секундах

    // Создаем сегменты таймлайна
    const segments: TimelineSegment[] = [];
    let currentTime = dayStart;

    for (const record of sortedHistory) {
      const startTime = new Date(record.startTime);
      const endTime = record.endTime ? new Date(record.endTime) : dayEnd;

      // Добавляем промежуток до начала статуса (если есть)
      if (startTime > currentTime) {
        const gapDuration = (startTime.getTime() - currentTime.getTime()) / 1000;
        if (gapDuration > 60) {
          // Показываем только промежутки больше минуты
          segments.push({
            statusId: 0,
            statusName: 'неактивен',
            color: '#e0e0e0',
            startTime: currentTime.toISOString(),
            endTime: startTime.toISOString(),
            duration: gapDuration,
            width: (gapDuration / totalDayDuration) * 100,
          });
        }
      }

      // Добавляем сегмент статуса
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;
      segments.push({
        statusId: record.newStatusId,
        statusName: STATUS_NAMES[record.newStatusId] || `статус ${record.newStatusId}`,
        color: STATUS_COLORS[record.newStatusId] || '#757575',
        startTime: record.startTime,
        endTime: record.endTime,
        duration,
        width: (duration / totalDayDuration) * 100,
      });

      currentTime = endTime;
    }

    // Добавляем оставшееся время до конца дня (если есть)
    if (currentTime < dayEnd) {
      const remainingDuration = (dayEnd.getTime() - currentTime.getTime()) / 1000;
      if (remainingDuration > 60) {
        segments.push({
          statusId: 0,
          statusName: 'неактивен',
          color: '#e0e0e0',
          startTime: currentTime.toISOString(),
          endTime: dayEnd.toISOString(),
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
    };
  }, [history, filters]);

  if (!timelineData) {
    return null;
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
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
          {formatTime(timelineData.dayStart.toISOString())} - {formatTime(timelineData.dayEnd.toISOString())}
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
                  {formatTime(segment.startTime)} - {segment.endTime ? formatTime(segment.endTime) : 'текущий'}
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
              }}
            >
              {segment.width > 5 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    fontSize: '0.7rem',
                  }}
                >
                  {segment.statusName}
                </Typography>
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Легенда */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Array.from(new Set(timelineData.segments.map((s) => s.statusId))).map((statusId) => {
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

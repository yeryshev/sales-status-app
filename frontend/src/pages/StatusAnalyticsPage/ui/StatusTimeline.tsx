import { memo, useMemo } from 'react';
import { Box, Typography, Paper, Tooltip, Chip, useTheme } from '@mui/material';
import { useAppSelector } from '@/shared/lib/hooks';
import {
  getStatusHistory,
  getStatusAnalyticsFilters,
  getStatusesForAnalytics,
  isSingleDayPeriod,
} from '@/entities/StatusAnalytics';
import { getStatusChartColor, getStatusChipColor } from '@/entities/StatusAnalytics';

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
  const theme = useTheme();
  const history = useAppSelector(getStatusHistory);
  const filters = useAppSelector(getStatusAnalyticsFilters);
  const users = useAppSelector((state) => state.statusAnalytics.users);
  const statuses = useAppSelector(getStatusesForAnalytics);

  const getStatusName = (statusId: number) =>
    statuses.find((status) => status.id === statusId)?.title || `статус ${statusId}`;

  // Определяем список пользователей для отображения
  const targetUserIds = useMemo(() => {
    if (filters.userId) {
      // Если выбран конкретный пользователь
      return [filters.userId];
    } else if (filters.departmentId) {
      // Если выбран отдел, берем всех пользователей из этого отдела
      return users
        .filter((user) => {
          if (filters.departmentId === 'managers') return user.isManager;
          if (filters.departmentId === 'account_managers') return user.isAccountManager;
          if (filters.departmentId === 'customer_care') return user.isCcManager;
          return false;
        })
        .map((user) => user.id);
    } else {
      // Если ничего не выбрано, не показываем таймлайн
      return [];
    }
  }, [filters.userId, filters.departmentId, users]);

  const timelineData = useMemo(() => {
    if (targetUserIds.length === 0 || !isSingleDayPeriod(filters.periodType, filters.startDate, filters.endDate)) {
      return null;
    }

    // Фиксируем текущее время один раз для всех пользователей
    // Используем UTC время (как в базе данных)
    const now = new Date();
    const currentDateTime = new Date(now.toISOString());

    // Создаем таймлайн для каждого пользователя
    return targetUserIds
      .map((userId) => {
        const user = users.find((u) => u.id === userId);
        const userHistory = history.filter((record: { userId: number }) => record.userId === userId);

        if (userHistory.length === 0) {
          return null;
        }

        // Сортируем по времени начала
        const sortedHistory = [...userHistory].sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );

        // Вычисляем рабочий день в Московском времени (09:00 - 19:00)
        // Создаем даты в Московском времени для отображения
        const moscowDayStart = new Date(filters.startDate + 'T09:00:00+03:00'); // 09:00 по Москве
        const moscowDayEnd = new Date(filters.startDate + 'T19:00:00+03:00'); // 19:00 по Москве

        // Для сравнения с данными из БД используем UTC даты (вычитаем 3 часа от московского времени)
        const dayStart = new Date(moscowDayStart.getTime() - 3 * 60 * 60 * 1000); // UTC начало рабочего дня
        const dayEnd = new Date(moscowDayEnd.getTime() - 3 * 60 * 60 * 1000); // UTC конец рабочего дня
        const totalDayDuration = (dayEnd.getTime() - dayStart.getTime()) / 1000; // в секундах

        // Находим записи, которые пересекаются с выбранным днем
        const dayRecords = sortedHistory.filter((record) => {
          const recordStart = new Date(record.startTime);
          const recordEnd = record.endTime ? new Date(record.endTime) : currentDateTime;

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

          // Для активных статусов используем фиксированное текущее время UTC, для завершенных - end_time
          const endTime = record.endTime ? new Date(record.endTime) : currentDateTime;

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
                color: theme.palette.grey[300],
                startTime: displayCurrentTime.toISOString(),
                endTime: displayStart.toISOString(),
                duration: gapDuration,
                width: (gapDuration / totalDayDuration) * 100,
              });
            }
          }

          // Добавляем сегмент статуса
          // Для шкалы таймлайна всегда используем segmentStart и segmentEnd (только рабочее время дня)
          // Это отличается от таблицы аналитики, где показывается полная продолжительность
          const duration = (segmentEnd.getTime() - segmentStart.getTime()) / 1000;

          // Для активных статусов корректируем duration для правильного отображения ширины
          const correctedDuration = isActiveStatus ? duration - 3 * 60 * 60 : duration;

          if (duration > 0) {
            const statusName = getStatusName(record.newStatusId);
            const baseColor = getStatusChartColor(record.newStatusId, 0, theme);

            segments.push({
              statusId: record.newStatusId,
              statusName: isActiveStatus ? `${statusName} (текущий)` : statusName,
              color: isActiveStatus ? baseColor : baseColor, // Можно добавить специальный цвет для активных
              startTime: displayStart.toISOString(),
              endTime: displayEnd.toISOString(),
              duration,
              width: (correctedDuration / totalDayDuration) * 100,
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
              color: hasActiveStatus ? theme.palette.grey[200] : theme.palette.grey[300], // Светло-серый для будущего времени
              startTime: displayCurrentTime.toISOString(),
              endTime: displayDayEnd.toISOString(),
              duration: remainingDuration,
              width: (remainingDuration / totalDayDuration) * 100,
            });
          }
        }

        return {
          userId,
          userName: user?.name || 'Неизвестный пользователь',
          userEmail: user?.email || '',
          segments,
          totalDuration: totalDayDuration,
          dayStart,
          dayEnd,
          moscowDayStart,
          moscowDayEnd,
        };
      })
      .filter((timeline) => timeline !== null);
  }, [history, filters, targetUserIds, users, theme, statuses]);

  if (!timelineData || timelineData.length === 0) {
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

  // Берем время дня от первого таймлайна (они все одинаковые)
  const firstTimeline = timelineData[0];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Таймлайн статусов за день
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {formatTime(firstTimeline.moscowDayStart.toISOString())} -{' '}
          {formatTime(firstTimeline.moscowDayEnd.toISOString())}
        </Typography>
      </Box>

      {/* Таймлайны для каждого пользователя */}
      {timelineData.map((userTimeline) => (
        <Box key={userTimeline.userId} sx={{ mb: 3 }}>
          {/* Контейнер с именем слева и таймлайном справа (при множественном выборе) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Имя пользователя слева (показываем только при множественном выборе) */}
            {timelineData.length > 1 && (
              <Box
                sx={{
                  minWidth: '140px',
                  maxWidth: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {(() => {
                  // Разделяем имя на части (имя и фамилия)
                  const nameParts = userTimeline.userName.split(' ');
                  const firstName = nameParts[0] || '';
                  const lastName = nameParts.slice(1).join(' ') || '';

                  return (
                    <>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.875rem',
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {firstName}
                      </Typography>
                      {lastName && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            lineHeight: 1.2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {lastName}
                        </Typography>
                      )}
                    </>
                  );
                })()}
              </Box>
            )}

            {/* Таймлайн пользователя */}
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                height: 40,
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {userTimeline.segments.map((segment, index) => (
                <Tooltip
                  key={index}
                  title={
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {segment.statusName.replace(' (текущий)', '')}
                      </Typography>
                      <Typography variant="body2">
                        {formatTime(segment.startTime)} -{' '}
                        {segment.statusName.includes('(текущий)')
                          ? 'текущий'
                          : segment.endTime
                            ? formatTime(segment.endTime)
                            : 'неизвестно'}
                      </Typography>
                      <Typography variant="body2">
                        Продолжительность:{' '}
                        {formatDuration(
                          segment.statusName.includes('(текущий)') ? segment.duration - 3 * 60 * 60 : segment.duration,
                        )}
                      </Typography>
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
                      borderRight:
                        index < userTimeline.segments.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                      // Специальные стили для разных типов сегментов
                      ...(segment.statusId === -1 && {
                        // Будущее время - пунктирная граница
                        border: `2px dashed ${theme.palette.grey[400]}`,
                        backgroundColor: 'transparent',
                      }),
                    }}
                  ></Box>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Легенда для пользователя */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mt: 1,
              ml: timelineData.length > 1 ? '156px' : 0,
            }}
          >
            {Array.from(new Set(userTimeline.segments.map((s) => s.statusId)))
              .filter((statusId) => statusId !== -1) // Исключаем сегмент "будущее время" (statusId = -1)
              .map((statusId) => {
                const segment = userTimeline.segments.find((s) => s.statusId === statusId);
                if (!segment) return null;

                const totalDuration = userTimeline.segments
                  .filter((s) => s.statusId === statusId)
                  .reduce((sum, s) => {
                    // Для текущих активных статусов вычитаем 3 часа
                    const isActive = s.statusName.includes('(текущий)');
                    const duration = isActive ? s.duration - 3 * 60 * 60 : s.duration;
                    return sum + duration;
                  }, 0);

                // Убираем "(текущий)" из названия для легенды
                const cleanStatusName = segment.statusName.replace(' (текущий)', '');

                return (
                  <Chip
                    key={statusId}
                    label={`${cleanStatusName} (${formatDuration(totalDuration)})`}
                    size="small"
                    color={getStatusChipColor(statusId)}
                    sx={{
                      fontWeight: 'bold',
                      height: '20px',
                      fontSize: '0.7rem',
                      '& .MuiChip-label': {
                        padding: '0 6px',
                      },
                    }}
                  />
                );
              })}
          </Box>
        </Box>
      ))}
    </Paper>
  );
});

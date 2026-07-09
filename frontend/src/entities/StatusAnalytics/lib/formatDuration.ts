export const formatDurationFromSeconds = (seconds: number): string => {
  if (seconds <= 0) return '0м';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}ч ${minutes}м`;
  if (hours > 0) return `${hours}ч`;
  return `${minutes}м`;
};

export const formatDurationFromHours = (hours: number): string => {
  return formatDurationFromSeconds(Math.round(hours * 3600));
};

export const formatDateTimeMoscow = (timeString: string): string => {
  return new Date(timeString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString + 'T12:00:00').toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
  });
};

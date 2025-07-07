export const formatValue = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}М`;
  }
  if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(0)}К`;
  }
  return numValue ? numValue.toLocaleString('ru-RU') : '0К';
};

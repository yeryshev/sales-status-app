/**
 * Вычисляет максимальное значение для шкалы Y с правильным округлением
 * @param values - массив значений
 * @param multiplier - множитель (по умолчанию 1.2 для 20% отступа)
 * @returns округленное максимальное значение
 */
export const calculateYAxisMax = (values: number[], multiplier = 1.2): number => {
  if (values.length === 0) return 100;

  const maxValue = Math.max(...values);
  const multipliedValue = maxValue * multiplier;

  // Округляем в большую сторону до десятков
  return Math.ceil(multipliedValue / 10) * 10;
};

/**
 * Вычисляет максимальное значение для шкалы Y с учетом стекированных данных
 * @param data - массив объектов с datasets
 * @param multiplier - множитель (по умолчанию 1.2 для 20% отступа)
 * @returns округленное максимальное значение
 */
export const calculateStackedYAxisMax = (
  data: Array<{ datasets: Array<{ data: number }> }>,
  multiplier = 1.2,
): number => {
  if (data.length === 0) return 100;

  // Вычисляем итоговые значения для каждого столбца
  const totalValues = data.map((item) => item.datasets.reduce((sum, dataset) => sum + dataset.data, 0));

  return calculateYAxisMax(totalValues, multiplier);
};

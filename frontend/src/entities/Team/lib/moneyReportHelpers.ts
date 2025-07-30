import { MoneyReportResponse, ProcessedMoneyData } from '../model/types/moneyReport';

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

// Функция для форматирования названия месяца
export const formatMonthLabel = (year: number, month: number): string => {
  return `${monthNames[month - 1]} ${year}`;
};

// Функция для создания ключа месяца
export const createMonthKey = (year: number, month: number): string => {
  return `${year}-${month.toString().padStart(2, '0')}`;
};

// Обработка данных финансового отчета
export const processMoneyReportData = (data: MoneyReportResponse): ProcessedMoneyData => {
  const managersSet = new Set<string>();
  const monthsSet = new Set<string>();
  const processedData: {
    [managerName: string]: {
      [monthKey: string]: {
        faktK: number;
        plan: number;
        nett: number;
      };
    };
  } = {};

  // Обрабатываем данные
  data.forEach((item) => {
    const managerName = item.managerName;
    const monthKey = createMonthKey(item.year, item.month);

    managersSet.add(managerName);
    monthsSet.add(monthKey);

    if (!processedData[managerName]) {
      processedData[managerName] = {};
    }

    processedData[managerName][monthKey] = {
      faktK: item.faktK,
      plan: item.plan,
      nett: item.nett,
    };
  });

  // Сортируем менеджеров по алфавиту
  const sortedManagers = Array.from(managersSet).sort();

  // Сортируем месяцы по дате
  const sortedMonths = Array.from(monthsSet).sort();

  return {
    managers: sortedManagers,
    months: sortedMonths,
    data: processedData,
  };
};

// Получение последнего месяца
export const getLastMonth = (months: string[]): string | null => {
  if (months.length === 0) {
    return null;
  }
  return months[months.length - 1];
};

// Форматирование числа в рубли
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Получение цвета для значения nett
export const getNettColor = (nett: number): string => {
  if (nett > 0) return '#4caf50'; // Зеленый для положительных значений
  if (nett < 0) return '#f44336'; // Красный для отрицательных значений
  return '#9e9e9e'; // Серый для нулевых значений
};

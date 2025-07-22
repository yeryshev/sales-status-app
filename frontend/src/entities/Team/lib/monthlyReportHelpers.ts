import {
  MonthlyReportResponse,
  ChartDataPoint,
  ProcessedChartData,
  ChannelData,
  ConversionData,
  SuccessByChannelData,
  SuccessByTypeData,
  FailedDealsData,
  ManagerData,
} from '../model/types/monthlyReport';

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

const channelColors = {
  call: '#FF6384', // Розовый
  email: '#36A2EB', // Синий
  event: '#FFCE56', // Желтый
  tickets: '#4BC0C0', // Бирюзовый
  campaign: '#9966FF', // Фиолетовый
  chatwoot: '#FF9F40', // Оранжевый
  telegram: '#C9CBCF', // Серый
  coldCall: '#E91E63', // Темно-розовый
  personalContact: '#8BC34A', // Зеленый
};

const typeColors = {
  upsale: '#FF6384',
  newsale: '#36A2EB',
  accounttransfer: '#FFCE56',
};

const failureColors = {
  noanswer: '#FF6384',
  bedservice: '#36A2EB',
  legalproblem: '#FFCE56',
  nomoreneeded: '#4BC0C0',
  nooportunity: '#9966FF',
};

// Функция для форматирования названия месяца
export const formatMonthLabel = (year: number, month: number): string => {
  return `${monthNames[month - 1]} ${year}`;
};

// Обработка данных для основного графика по менеджерам
export const processMonthlyReportData = (data: MonthlyReportResponse): ProcessedChartData => {
  const monthDataMap = new Map<string, ChartDataPoint>();
  const managersSet = new Set<string>();

  // Обрабатываем данные по каждому менеджеру
  data.result.users.forEach((user) => {
    managersSet.add(user.managerName);

    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;
      const monthLabel = `${monthNames[report.month - 1]} ${report.year}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, {
          month: monthLabel,
          year: report.year,
          monthNumber: report.month,
          managers: {},
          total: 0,
        });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.managers[user.managerName] = report.leadsTotal;
      monthData.total += report.leadsTotal;
    });
  });

  // Сортируем данные по дате
  const sortedData = Array.from(monthDataMap.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.monthNumber - b.monthNumber;
  });

  return {
    data: sortedData,
    managers: Array.from(managersSet).sort(),
  };
};

// Обработка данных по каналам
export const processChannelData = (data: MonthlyReportResponse): ChannelData[] => {
  const channelTotals = {
    call: 0,
    email: 0,
    event: 0,
    tickets: 0,
    campaign: 0,
    chatwoot: 0,
    telegram: 0,
    coldCall: 0,
    personalContact: 0,
  };

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      channelTotals.call += report.leadsCall;
      channelTotals.email += report.leadsEmail;
      channelTotals.event += report.leadsEvent;
      channelTotals.tickets += report.leadsTickets;
      channelTotals.campaign += report.leadsCampaign;
      channelTotals.chatwoot += report.leadsChatwoot;
      channelTotals.telegram += report.leadsTelegram;
      channelTotals.coldCall += report.leadsColdCall;
      channelTotals.personalContact += report.leadsPersonalContact;
    });
  });

  const channelLabels = {
    call: 'Входящие звонки',
    email: 'Email',
    event: 'Ивенты',
    tickets: 'Тикеты',
    campaign: 'Кампании',
    chatwoot: 'Chatwoot',
    telegram: 'Telegram',
    coldCall: 'Прозвоны регистраций',
    personalContact: 'Личные контакты',
  };

  return Object.entries(channelTotals)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      channel: channelLabels[key as keyof typeof channelLabels],
      value,
      color: channelColors[key as keyof typeof channelColors],
    }))
    .sort((a, b) => b.value - a.value);
};

// Обработка данных конверсии
export const processConversionData = (data: MonthlyReportResponse): ConversionData[] => {
  const monthDataMap = new Map<string, { received: number; qualified: number }>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, { received: 0, qualified: 0 });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.received += report.leadsTotal;
      monthData.qualified += report.leadsQualified;
    });
  });

  return Array.from(monthDataMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      const conversionRate = data.received > 0 ? (data.qualified / data.received) * 100 : 0;

      return {
        period: monthLabel,
        received: data.received,
        qualified: data.qualified,
        conversionRate: Math.round(conversionRate * 10) / 10,
      };
    })
    .sort((a, b) => {
      const [aYear, aMonth] = a.period.split(' ');
      const [bYear, bMonth] = b.period.split(' ');
      const aMonthIndex = monthNames.indexOf(aMonth);
      const bMonthIndex = monthNames.indexOf(bMonth);

      if (parseInt(aYear) !== parseInt(bYear)) {
        return parseInt(aYear) - parseInt(bYear);
      }
      return aMonthIndex - bMonthIndex;
    });
};

// Обработка данных конверсии по месяцам
export const processConversionDataByMonth = (
  data: MonthlyReportResponse,
): Array<{ label: string; value: number; color: string }> => {
  const monthDataMap = new Map<string, { received: number; qualified: number; successful: number }>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, { received: 0, qualified: 0, successful: 0 });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.received += report.leadsTotal;
      monthData.qualified += report.leadsQualified;
      monthData.successful += report.leadsSuccess;
    });
  });

  // Сортируем данные по дате
  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return {
        month: monthLabel,
        year: parseInt(year),
        monthNumber: parseInt(month),
        data,
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const result: Array<{ label: string; value: number; color: string }> = [];

  sortedData.forEach((monthData) => {
    result.push(
      {
        label: 'Получено лидов',
        value: monthData.data.received,
        color: '#1976d2', // Синий
      },
      {
        label: 'Квалифицировано',
        value: monthData.data.qualified,
        color: '#ff9800', // Оранжевый
      },
      {
        label: 'Успешно реализовано',
        value: monthData.data.successful,
        color: '#4caf50', // Зеленый
      },
    );
  });

  return result;
};

// Обработка данных конверсии для столбчатого графика
export const processConversionDataForBarChart = (
  data: MonthlyReportResponse,
): Array<{ label: string; value: number; color: string }> => {
  const monthDataMap = new Map<string, { received: number; qualified: number; successful: number }>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, { received: 0, qualified: 0, successful: 0 });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.received += report.leadsTotal;
      monthData.qualified += report.leadsQualified;
      monthData.successful += report.leadsSuccess;
    });
  });

  // Сортируем данные по дате
  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return {
        month: monthLabel,
        year: parseInt(year),
        monthNumber: parseInt(month),
        data,
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const result: Array<{ label: string; value: number; color: string }> = [];

  sortedData.forEach((monthData) => {
    result.push(
      {
        label: 'Получено лидов',
        value: monthData.data.received,
        color: '#1976d2', // Синий
      },
      {
        label: 'Квалифицировано',
        value: monthData.data.qualified,
        color: '#ff9800', // Оранжевый
      },
      {
        label: 'Успешно реализовано',
        value: monthData.data.successful,
        color: '#4caf50', // Зеленый
      },
    );
  });

  return result;
};

// Обработка данных конверсии по месяцам для столбчатого графика с группировкой по месяцам
export const processConversionDataForGroupedBarChart = (
  data: MonthlyReportResponse,
): {
  chartData: Array<{ label: string; value: number; color: string }>;
  monthLabels: string[];
} => {
  const monthDataMap = new Map<string, { received: number; qualified: number; successful: number }>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, { received: 0, qualified: 0, successful: 0 });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.received += report.leadsTotal;
      monthData.qualified += report.leadsQualified;
      monthData.successful += report.leadsSuccess;
    });
  });

  // Сортируем данные по дате
  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return {
        month: monthLabel,
        year: parseInt(year),
        monthNumber: parseInt(month),
        data,
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const chartData: Array<{ label: string; value: number; color: string }> = [];
  const monthLabels: string[] = [];

  sortedData.forEach((monthData) => {
    monthLabels.push(monthData.month);
    chartData.push(
      {
        label: 'Получено лидов',
        value: monthData.data.received,
        color: '#1976d2', // Синий
      },
      {
        label: 'Квалифицировано',
        value: monthData.data.qualified,
        color: '#ff9800', // Оранжевый
      },
      {
        label: 'Успешно реализовано',
        value: monthData.data.successful,
        color: '#4caf50', // Зеленый
      },
    );
  });

  return { chartData, monthLabels };
};

// Обработка данных успешности по каналам
export const processSuccessByChannelData = (data: MonthlyReportResponse): SuccessByChannelData[] => {
  const channelData = {
    call: { total: 0, successful: 0 },
    email: { total: 0, successful: 0 },
    event: { total: 0, successful: 0 },
    tickets: { total: 0, successful: 0 },
    campaign: { total: 0, successful: 0 },
    chatwoot: { total: 0, successful: 0 },
    telegram: { total: 0, successful: 0 },
    coldCall: { total: 0, successful: 0 },
    personalContact: { total: 0, successful: 0 },
  };

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      channelData.call.total += report.leadsCall;
      channelData.call.successful += report.leadsSuccessByCall;
      channelData.email.total += report.leadsEmail;
      channelData.email.successful += report.leadsSuccessByEmail;
      channelData.event.total += report.leadsEvent;
      channelData.event.successful += report.leadsSuccessByEvent;
      channelData.tickets.total += report.leadsTickets;
      channelData.tickets.successful += report.leadsSuccessByTickets;
      channelData.campaign.total += report.leadsCampaign;
      channelData.campaign.successful += report.leadsSuccessByCampaign;
      channelData.chatwoot.total += report.leadsChatwoot;
      channelData.chatwoot.successful += report.leadsSuccessByChatwoot;
      channelData.telegram.total += report.leadsTelegram;
      channelData.telegram.successful += report.leadsSuccessByTelegram;
      channelData.coldCall.total += report.leadsColdCall;
      channelData.coldCall.successful += report.leadsSuccessByColdCall;
      channelData.personalContact.total += report.leadsPersonalContact;
      channelData.personalContact.successful += report.leadsSuccessByPersonalContact;
    });
  });

  const channelLabels = {
    call: 'Входящие звонки',
    email: 'Email',
    event: 'Ивенты',
    tickets: 'Тикеты',
    campaign: 'Кампании',
    chatwoot: 'Chatwoot',
    telegram: 'Telegram',
    coldCall: 'Прозвоны регистраций',
    personalContact: 'Личные контакты',
  };

  return Object.entries(channelData)
    .filter(([, data]) => data.total > 0)
    .map(([key, data]) => {
      const successRate = data.total > 0 ? (data.successful / data.total) * 100 : 0;
      return {
        channel: channelLabels[key as keyof typeof channelLabels],
        total: data.total,
        successful: data.successful,
        successRate: Math.round(successRate * 10) / 10,
        color: channelColors[key as keyof typeof channelColors],
      };
    })
    .sort((a, b) => b.successful - a.successful);
};

// Обработка данных успешности по каналам по месяцам
export const processSuccessByChannelDataByMonth = (data: MonthlyReportResponse): ManagerData[] => {
  const monthDataMap = new Map<
    string,
    {
      call: number;
      email: number;
      event: number;
      tickets: number;
      campaign: number;
      chatwoot: number;
      telegram: number;
      coldCall: number;
      personalContact: number;
    }
  >();
  const channelsSet = new Set<string>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, {
          call: 0,
          email: 0,
          event: 0,
          tickets: 0,
          campaign: 0,
          chatwoot: 0,
          telegram: 0,
          coldCall: 0,
          personalContact: 0,
        });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.call += report.leadsSuccessByCall;
      monthData.email += report.leadsSuccessByEmail;
      monthData.event += report.leadsSuccessByEvent;
      monthData.tickets += report.leadsSuccessByTickets;
      monthData.campaign += report.leadsSuccessByCampaign;
      monthData.chatwoot += report.leadsSuccessByChatwoot;
      monthData.telegram += report.leadsSuccessByTelegram;
      monthData.coldCall += report.leadsSuccessByColdCall;
      monthData.personalContact += report.leadsSuccessByPersonalContact;

      if (report.leadsSuccessByCall > 0) channelsSet.add('call');
      if (report.leadsSuccessByEmail > 0) channelsSet.add('email');
      if (report.leadsSuccessByEvent > 0) channelsSet.add('event');
      if (report.leadsSuccessByTickets > 0) channelsSet.add('tickets');
      if (report.leadsSuccessByCampaign > 0) channelsSet.add('campaign');
      if (report.leadsSuccessByChatwoot > 0) channelsSet.add('chatwoot');
      if (report.leadsSuccessByTelegram > 0) channelsSet.add('telegram');
      if (report.leadsSuccessByColdCall > 0) channelsSet.add('coldCall');
      if (report.leadsSuccessByPersonalContact > 0) channelsSet.add('personalContact');
    });
  });

  const channelLabels = {
    call: 'Входящие звонки',
    email: 'Email',
    event: 'Ивенты',
    tickets: 'Тикеты',
    campaign: 'Кампании',
    chatwoot: 'Chatwoot',
    telegram: 'Telegram',
    coldCall: 'Прозвоны регистраций',
    personalContact: 'Личные контакты',
  };

  const channelColors = {
    call: '#FF6384',
    email: '#36A2EB',
    event: '#FFCE56',
    tickets: '#4BC0C0',
    campaign: '#9966FF',
    chatwoot: '#FF9F40',
    telegram: '#C9CBCF',
    coldCall: '#E91E63',
    personalContact: '#8BC34A',
  };

  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, channelData]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return { month: monthLabel, year: parseInt(year), monthNumber: parseInt(month), channelData };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const channels = Array.from(channelsSet).sort();

  return sortedData.map((monthData) => {
    const datasets = channels.map((channel) => ({
      label: channelLabels[channel as keyof typeof channelLabels],
      data: monthData.channelData[channel as keyof typeof monthData.channelData] || 0,
      backgroundColor: channelColors[channel as keyof typeof channelColors],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

// Обработка данных по каналам в процентном режиме
export const processSuccessByChannelDataByMonthPercentage = (data: MonthlyReportResponse): ManagerData[] => {
  const absoluteData = processSuccessByChannelDataByMonth(data);

  return absoluteData.map((monthData) => {
    const total = monthData.datasets.reduce((sum, dataset) => sum + dataset.data, 0);

    if (total === 0) {
      return {
        label: monthData.label,
        datasets: monthData.datasets.map((dataset) => ({ ...dataset, data: 0 })),
      };
    }

    // Вычисляем проценты с округлением
    const datasetsWithPercentages = monthData.datasets.map((dataset) => ({
      ...dataset,
      data: Math.round((dataset.data / total) * 100),
    }));

    // Корректируем последний элемент, чтобы сумма была ровно 100%
    const calculatedSum = datasetsWithPercentages.reduce((sum, dataset) => sum + dataset.data, 0);
    if (calculatedSum !== 100 && datasetsWithPercentages.length > 0) {
      const lastIndex = datasetsWithPercentages.length - 1;
      datasetsWithPercentages[lastIndex].data += 100 - calculatedSum;
    }

    return {
      label: monthData.label,
      datasets: datasetsWithPercentages,
    };
  });
};

// Обработка данных успешности по типам
export const processSuccessByTypeData = (data: MonthlyReportResponse): SuccessByTypeData[] => {
  const typeTotals = {
    upsale: 0,
    newsale: 0,
    accounttransfer: 0,
  };

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      typeTotals.upsale += report.leads142Upsale;
      typeTotals.newsale += report.leads142Newsale;
      typeTotals.accounttransfer += report.leads142Accounttransfer;
    });
  });

  const typeLabels = {
    upsale: 'Апсейл',
    newsale: 'Новые продажи',
    accounttransfer: 'Смена аккаунта',
  };

  return Object.entries(typeTotals)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      type: typeLabels[key as keyof typeof typeLabels],
      value,
      color: typeColors[key as keyof typeof typeColors],
    }))
    .sort((a, b) => b.value - a.value);
};

// Обработка данных успешности по типам по месяцам
export const processSuccessByTypeDataByMonth = (data: MonthlyReportResponse): ManagerData[] => {
  const monthDataMap = new Map<
    string,
    {
      upsale: number;
      newsale: number;
      accounttransfer: number;
    }
  >();
  const typesSet = new Set<string>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, {
          upsale: 0,
          newsale: 0,
          accounttransfer: 0,
        });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.upsale += report.leads142Upsale;
      monthData.newsale += report.leads142Newsale;
      monthData.accounttransfer += report.leads142Accounttransfer;

      if (report.leads142Upsale > 0) typesSet.add('upsale');
      if (report.leads142Newsale > 0) typesSet.add('newsale');
      if (report.leads142Accounttransfer > 0) typesSet.add('accounttransfer');
    });
  });

  const typeLabels = {
    upsale: 'Апсейл',
    newsale: 'Новые продажи',
    accounttransfer: 'Смена аккаунта',
  };

  const typeColors = {
    upsale: '#FF6384',
    newsale: '#36A2EB',
    accounttransfer: '#FFCE56',
  };

  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, typeData]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return { month: monthLabel, year: parseInt(year), monthNumber: parseInt(month), typeData };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const types = Array.from(typesSet).sort();

  return sortedData.map((monthData) => {
    const datasets = types.map((type) => ({
      label: typeLabels[type as keyof typeof typeLabels],
      data: monthData.typeData[type as keyof typeof monthData.typeData] || 0,
      backgroundColor: typeColors[type as keyof typeof typeColors],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

// Обработка данных по типу в процентном режиме
export const processSuccessByTypeDataByMonthPercentage = (data: MonthlyReportResponse): ManagerData[] => {
  const absoluteData = processSuccessByTypeDataByMonth(data);

  return absoluteData.map((monthData) => {
    const total = monthData.datasets.reduce((sum, dataset) => sum + dataset.data, 0);

    if (total === 0) {
      return {
        label: monthData.label,
        datasets: monthData.datasets.map((dataset) => ({ ...dataset, data: 0 })),
      };
    }

    // Вычисляем проценты с округлением
    const datasetsWithPercentages = monthData.datasets.map((dataset) => ({
      ...dataset,
      data: Math.round((dataset.data / total) * 100),
    }));

    // Корректируем последний элемент, чтобы сумма была ровно 100%
    const calculatedSum = datasetsWithPercentages.reduce((sum, dataset) => sum + dataset.data, 0);
    if (calculatedSum !== 100 && datasetsWithPercentages.length > 0) {
      const lastIndex = datasetsWithPercentages.length - 1;
      datasetsWithPercentages[lastIndex].data += 100 - calculatedSum;
    }

    return {
      label: monthData.label,
      datasets: datasetsWithPercentages,
    };
  });
};

// Обработка данных неуспешных сделок
export const processFailedDealsData = (data: MonthlyReportResponse): FailedDealsData[] => {
  const failureTotals = {
    noanswer: 0,
    bedservice: 0,
    legalproblem: 0,
    nomoreneeded: 0,
    nooportunity: 0,
  };

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      failureTotals.noanswer += report.leads143Noanswer;
      failureTotals.bedservice += report.leads143Bedservice;
      failureTotals.legalproblem += report.leads143Legalproblem;
      failureTotals.nomoreneeded += report.leads143Nomoreneeded;
      failureTotals.nooportunity += report.leads143Noopportunity;
    });
  });

  const failureLabels = {
    noanswer: 'Перестали отвечать',
    bedservice: 'Не устроили условия',
    legalproblem: 'Не согласовали договор',
    nomoreneeded: 'Пропала потребность',
    nooportunity: 'Нет возможности реализовать',
  };

  return Object.entries(failureTotals)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      reason: failureLabels[key as keyof typeof failureLabels],
      value,
      color: failureColors[key as keyof typeof failureColors],
    }))
    .sort((a, b) => b.value - a.value);
};

// Обработка данных неуспешных сделок по месяцам
export const processFailedDealsDataByMonth = (data: MonthlyReportResponse): ManagerData[] => {
  const monthDataMap = new Map<
    string,
    {
      noanswer: number;
      bedservice: number;
      legalproblem: number;
      nomoreneeded: number;
      nooportunity: number;
    }
  >();
  const reasonsSet = new Set<string>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, {
          noanswer: 0,
          bedservice: 0,
          legalproblem: 0,
          nomoreneeded: 0,
          nooportunity: 0,
        });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.noanswer += report.leads143Noanswer;
      monthData.bedservice += report.leads143Bedservice;
      monthData.legalproblem += report.leads143Legalproblem;
      monthData.nomoreneeded += report.leads143Nomoreneeded;
      monthData.nooportunity += report.leads143Noopportunity;

      if (report.leads143Noanswer > 0) reasonsSet.add('noanswer');
      if (report.leads143Bedservice > 0) reasonsSet.add('bedservice');
      if (report.leads143Legalproblem > 0) reasonsSet.add('legalproblem');
      if (report.leads143Nomoreneeded > 0) reasonsSet.add('nomoreneeded');
      if (report.leads143Noopportunity > 0) reasonsSet.add('nooportunity');
    });
  });

  const failureLabels = {
    noanswer: 'Перестали отвечать',
    bedservice: 'Не устроили условия',
    legalproblem: 'Не согласовали договор',
    nomoreneeded: 'Пропала потребность',
    nooportunity: 'Нет возможности реализовать',
  };

  const failureColors = {
    noanswer: '#FF6384',
    bedservice: '#36A2EB',
    legalproblem: '#FFCE56',
    nomoreneeded: '#4BC0C0',
    nooportunity: '#9966FF',
  };

  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, failureData]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return { month: monthLabel, year: parseInt(year), monthNumber: parseInt(month), failureData };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const reasons = Array.from(reasonsSet).sort();

  return sortedData.map((monthData) => {
    const datasets = reasons.map((reason) => ({
      label: failureLabels[reason as keyof typeof failureLabels],
      data: monthData.failureData[reason as keyof typeof monthData.failureData] || 0,
      backgroundColor: failureColors[reason as keyof typeof failureColors],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

// Обработка данных по каналам по месяцам
export const processChannelDataByMonth = (data: MonthlyReportResponse): ManagerData[] => {
  const monthDataMap = new Map<
    string,
    {
      call: number;
      email: number;
      event: number;
      tickets: number;
      campaign: number;
      chatwoot: number;
      telegram: number;
      coldCall: number;
      personalContact: number;
    }
  >();
  const channelsSet = new Set<string>();

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, {
          call: 0,
          email: 0,
          event: 0,
          tickets: 0,
          campaign: 0,
          chatwoot: 0,
          telegram: 0,
          coldCall: 0,
          personalContact: 0,
        });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.call += report.leadsCall;
      monthData.email += report.leadsEmail;
      monthData.event += report.leadsEvent;
      monthData.tickets += report.leadsTickets;
      monthData.campaign += report.leadsCampaign;
      monthData.chatwoot += report.leadsChatwoot;
      monthData.telegram += report.leadsTelegram;
      monthData.coldCall += report.leadsColdCall;
      monthData.personalContact += report.leadsPersonalContact;

      if (report.leadsCall > 0) channelsSet.add('call');
      if (report.leadsEmail > 0) channelsSet.add('email');
      if (report.leadsEvent > 0) channelsSet.add('event');
      if (report.leadsTickets > 0) channelsSet.add('tickets');
      if (report.leadsCampaign > 0) channelsSet.add('campaign');
      if (report.leadsChatwoot > 0) channelsSet.add('chatwoot');
      if (report.leadsTelegram > 0) channelsSet.add('telegram');
      if (report.leadsColdCall > 0) channelsSet.add('coldCall');
      if (report.leadsPersonalContact > 0) channelsSet.add('personalContact');
    });
  });

  const channelLabels = {
    call: 'Входящие звонки',
    email: 'Email',
    event: 'Ивенты',
    tickets: 'Тикеты',
    campaign: 'Кампании',
    chatwoot: 'Chatwoot',
    telegram: 'Telegram',
    coldCall: 'Прозвоны регистраций',
    personalContact: 'Личные контакты',
  };

  const channelColors = {
    call: '#FF6384',
    email: '#36A2EB',
    event: '#FFCE56',
    tickets: '#4BC0C0',
    campaign: '#9966FF',
    chatwoot: '#FF9F40',
    telegram: '#C9CBCF',
    coldCall: '#E91E63',
    personalContact: '#8BC34A',
  };

  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, channelData]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return { month: monthLabel, year: parseInt(year), monthNumber: parseInt(month), channelData };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const channels = Array.from(channelsSet).sort();

  return sortedData.map((monthData) => {
    const datasets = channels.map((channel) => ({
      label: channelLabels[channel as keyof typeof channelLabels],
      data: monthData.channelData[channel as keyof typeof monthData.channelData] || 0,
      backgroundColor: channelColors[channel as keyof typeof channelColors],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

// Обработка данных по менеджерам
export const processManagerData = (data: MonthlyReportResponse): ManagerData[] => {
  const managerColors = [
    '#FF6384', // Розовый
    '#36A2EB', // Синий
    '#FFCE56', // Желтый
    '#4BC0C0', // Бирюзовый
    '#9966FF', // Фиолетовый
    '#FF9F40', // Оранжевый
    '#C9CBCF', // Серый
    '#E91E63', // Темно-розовый
    '#8BC34A', // Зеленый
    '#9C27B0', // Пурпурный
  ];

  const monthDataMap = new Map<string, { [managerName: string]: number }>();
  const managersSet = new Set<string>();

  data.result.users.forEach((user) => {
    managersSet.add(user.managerName);

    user.reports.forEach((report) => {
      const key = `${report.year}-${report.month.toString().padStart(2, '0')}`;

      if (!monthDataMap.has(key)) {
        monthDataMap.set(key, {});
      }

      const monthData = monthDataMap.get(key)!;
      monthData[user.managerName] = (monthData[user.managerName] || 0) + report.leadsTotal;
    });
  });

  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, managerData]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return { month: monthLabel, year: parseInt(year), monthNumber: parseInt(month), managerData };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthNumber - b.monthNumber;
    });

  const managers = Array.from(managersSet).sort();

  return sortedData.map((monthData) => {
    const datasets = managers.map((manager, index) => ({
      label: manager,
      data: monthData.managerData[manager] || 0,
      backgroundColor: managerColors[index % managerColors.length],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

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
  cold_call: '#E91E63', // Темно-розовый
  personal_contact: '#8BC34A', // Зеленый
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

export const processMonthlyReportData = (data: MonthlyReportResponse): ProcessedChartData => {
  const monthDataMap = new Map<string, ChartDataPoint>();
  const managersSet = new Set<string>();

  // Обрабатываем данные по каждому менеджеру
  data.result.users.forEach((user) => {
    managersSet.add(user.manager_name);

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
      monthData.managers[user.manager_name] = report.leads_total;
      monthData.total += report.leads_total;
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
    cold_call: 0,
    personal_contact: 0,
  };

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      channelTotals.call += report.leads_call;
      channelTotals.email += report.leads_email;
      channelTotals.event += report.leads_event;
      channelTotals.tickets += report.leads_tickets;
      channelTotals.campaign += report.leads_campaign;
      channelTotals.chatwoot += report.leads_chatwoot;
      channelTotals.telegram += report.leads_telegram;
      channelTotals.cold_call += report.leads_cold_call;
      channelTotals.personal_contact += report.leads_personal_contact;
    });
  });

  const channelLabels = {
    call: 'Звонки',
    email: 'Email',
    event: 'События',
    tickets: 'Тикеты',
    campaign: 'Кампании',
    chatwoot: 'Chatwoot',
    telegram: 'Telegram',
    cold_call: 'Холодные звонки',
    personal_contact: 'Личные контакты',
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
      monthData.received += report.leads_total;
      monthData.qualified += report.leads_qualified;
    });
  });

  return Array.from(monthDataMap.entries())
    .map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return {
        period: monthLabel,
        received: data.received,
        qualified: data.qualified,
        conversionRate: data.received > 0 ? (data.qualified / data.received) * 100 : 0,
      };
    })
    .sort((a, b) => {
      const [aYear, aMonth] = a.period.split(' ');
      const [bYear, bMonth] = b.period.split(' ');
      const aMonthIndex = monthNames.indexOf(aMonth);
      const bMonthIndex = monthNames.indexOf(bMonth);

      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return aMonthIndex - bMonthIndex;
    });
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
    cold_call: { total: 0, successful: 0 },
    personal_contact: { total: 0, successful: 0 },
  };

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      channelData.call.total += report.leads_call;
      channelData.call.successful += report.leads_success_by_call;
      channelData.email.total += report.leads_email;
      channelData.email.successful += report.leads_success_by_email;
      channelData.event.total += report.leads_event;
      channelData.event.successful += report.leads_success_by_event;
      channelData.tickets.total += report.leads_tickets;
      channelData.tickets.successful += report.leads_success_by_tickets;
      channelData.campaign.total += report.leads_campaign;
      channelData.campaign.successful += report.leads_success_by_campaign;
      channelData.chatwoot.total += report.leads_chatwoot;
      channelData.chatwoot.successful += report.leads_success_by_chatwoot;
      channelData.telegram.total += report.leads_telegram;
      channelData.telegram.successful += report.leads_success_by_telegram;
      channelData.cold_call.total += report.leads_cold_call;
      channelData.cold_call.successful += report.leads_success_by_cold_call;
      channelData.personal_contact.total += report.leads_personal_contact;
      channelData.personal_contact.successful += report.leads_success_by_personal_contact;
    });
  });

  const channelLabels = {
    call: 'Звонки',
    email: 'Email',
    event: 'События',
    tickets: 'Тикеты',
    campaign: 'Кампании',
    chatwoot: 'Chatwoot',
    telegram: 'Telegram',
    cold_call: 'Холодные звонки',
    personal_contact: 'Личные контакты',
  };

  return Object.entries(channelData)
    .filter(([, data]) => data.total > 0)
    .map(([key, data]) => ({
      channel: channelLabels[key as keyof typeof channelLabels],
      total: data.total,
      successful: data.successful,
      successRate: data.total > 0 ? (data.successful / data.total) * 100 : 0,
      color: channelColors[key as keyof typeof channelColors],
    }))
    .sort((a, b) => b.successRate - a.successRate);
};

// Обработка данных успешности по типу
export const processSuccessByTypeData = (data: MonthlyReportResponse): SuccessByTypeData[] => {
  const typeTotals = {
    upsale: 0,
    newsale: 0,
    accounttransfer: 0,
  };

  data.result.users.forEach((user) => {
    user.reports.forEach((report) => {
      typeTotals.upsale += report.leads_142_upsale;
      typeTotals.newsale += report.leads_142_newsale;
      typeTotals.accounttransfer += report.leads_142_accounttransfer;
    });
  });

  const typeLabels = {
    upsale: 'Апсейл',
    newsale: 'Новые продажи',
    accounttransfer: 'Перевод аккаунтов',
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
      failureTotals.noanswer += report.leads_143_noanswer;
      failureTotals.bedservice += report.leads_143_bedservice;
      failureTotals.legalproblem += report.leads_143_legalproblem;
      failureTotals.nomoreneeded += report.leads_143_nomoreneeded;
      failureTotals.nooportunity += report.leads_143_nooportunity;
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

// Обработка данных неуспешных сделок по месяцам для стекированного графика
export const processFailedDealsDataByMonth = (data: MonthlyReportResponse): ManagerData[] => {
  const monthDataMap = new Map<string, { [reason: string]: number }>();
  const reasonsSet = new Set<string>();

  // Обрабатываем данные по каждому менеджеру
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
      monthData.noanswer += report.leads_143_noanswer;
      monthData.bedservice += report.leads_143_bedservice;
      monthData.legalproblem += report.leads_143_legalproblem;
      monthData.nomoreneeded += report.leads_143_nomoreneeded;
      monthData.nooportunity += report.leads_143_nooportunity;

      // Добавляем причины в множество
      if (report.leads_143_noanswer > 0) reasonsSet.add('noanswer');
      if (report.leads_143_bedservice > 0) reasonsSet.add('bedservice');
      if (report.leads_143_legalproblem > 0) reasonsSet.add('legalproblem');
      if (report.leads_143_nomoreneeded > 0) reasonsSet.add('nomoreneeded');
      if (report.leads_143_nooportunity > 0) reasonsSet.add('nooportunity');
    });
  });

  const failureLabels = {
    noanswer: 'Перестали отвечать',
    bedservice: 'Не устроили условия',
    legalproblem: 'Не согласовали договор',
    nomoreneeded: 'Пропала потребность',
    nooportunity: 'Нет возможности реализовать',
  };

  // Сортируем данные по дате
  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, reasonData]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return {
        month: monthLabel,
        year: parseInt(year),
        monthNumber: parseInt(month),
        reasonData,
      };
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
      data: monthData.reasonData[reason] || 0,
      backgroundColor: failureColors[reason as keyof typeof failureColors],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

// Обработка данных лидов по каналам для стекированного графика
export const processChannelDataByMonth = (data: MonthlyReportResponse): ManagerData[] => {
  const monthDataMap = new Map<string, { [channel: string]: number }>();
  const channelsSet = new Set<string>();

  // Обрабатываем данные по каждому менеджеру
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
          cold_call: 0,
          personal_contact: 0,
        });
      }

      const monthData = monthDataMap.get(key)!;
      monthData.call += report.leads_call;
      monthData.email += report.leads_email;
      monthData.event += report.leads_event;
      monthData.tickets += report.leads_tickets;
      monthData.campaign += report.leads_campaign;
      monthData.chatwoot += report.leads_chatwoot;
      monthData.telegram += report.leads_telegram;
      monthData.cold_call += report.leads_cold_call;
      monthData.personal_contact += report.leads_personal_contact;

      // Добавляем каналы в множество
      if (report.leads_call > 0) channelsSet.add('call');
      if (report.leads_email > 0) channelsSet.add('email');
      if (report.leads_event > 0) channelsSet.add('event');
      if (report.leads_tickets > 0) channelsSet.add('tickets');
      if (report.leads_campaign > 0) channelsSet.add('campaign');
      if (report.leads_chatwoot > 0) channelsSet.add('chatwoot');
      if (report.leads_telegram > 0) channelsSet.add('telegram');
      if (report.leads_cold_call > 0) channelsSet.add('cold_call');
      if (report.leads_personal_contact > 0) channelsSet.add('personal_contact');
    });
  });

  const channelLabels = {
    call: 'Звонки',
    email: 'Email',
    event: 'События',
    tickets: 'Тикеты',
    campaign: 'Кампании',
    chatwoot: 'Chatwoot',
    telegram: 'Telegram',
    cold_call: 'Холодные звонки',
    personal_contact: 'Личные контакты',
  };

  // Сортируем данные по дате
  const sortedData = Array.from(monthDataMap.entries())
    .map(([key, channelData]) => {
      const [year, month] = key.split('-');
      const monthLabel = `${monthNames[parseInt(month) - 1]} ${year}`;
      return {
        month: monthLabel,
        year: parseInt(year),
        monthNumber: parseInt(month),
        channelData,
      };
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
      data: monthData.channelData[channel] || 0,
      backgroundColor: channelColors[channel as keyof typeof channelColors],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

// Обработка данных по менеджерам для стекированного графика
export const processManagerData = (data: MonthlyReportResponse): ManagerData[] => {
  const processedData = processMonthlyReportData(data);
  const managerColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF',
    '#FF6384',
    '#4BC0C0',
    '#FFCE56',
  ];

  return processedData.data.map((monthData) => {
    const datasets = processedData.managers.map((manager, index) => ({
      label: manager,
      data: monthData.managers[manager] || 0,
      backgroundColor: managerColors[index % managerColors.length],
    }));

    return {
      label: monthData.month,
      datasets,
    };
  });
};

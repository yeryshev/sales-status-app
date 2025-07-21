export interface MonthlyReportData {
  id: number;
  year: number;
  month: number;
  id_inside: number;
  leads_call: number;
  leads_email: number;
  leads_event: number;
  leads_total: number;
  leads_success: number;
  leads_tickets: number;
  leads_campaign: number;
  leads_chatwoot: number;
  leads_telegram: number;
  leads_cold_call: number;
  leads_qualified: number;
  leads_142_upsale: number;
  leads_142_newsale: number;
  leads_143_noanswer: number;
  leads_143_bedservice: number;
  leads_success_by_call: number;
  leads_143_legalproblem: number;
  leads_143_nomoreneeded: number;
  leads_143_nooportunity: number;
  leads_personal_contact: number;
  leads_success_by_email: number;
  leads_success_by_event: number;
  leads_success_by_tickets: number;
  leads_142_accounttransfer: number;
  leads_success_by_campaign: number;
  leads_success_by_chatwoot: number;
  leads_success_by_telegram: number;
  leads_success_by_cold_call: number;
  leads_success_by_personal_contact: number;
}

export interface MonthlyReportUser {
  id_selectel: number;
  manager_name: string;
  reports: MonthlyReportData[];
}

export interface MonthlyReportOverall {
  type: 'over_all';
  reports: MonthlyReportData[];
}

export interface MonthlyReportResponse {
  result: {
    users: MonthlyReportUser[];
    over_all: MonthlyReportOverall;
  };
}

export interface ChartDataPoint {
  month: string;
  year: number;
  monthNumber: number;
  managers: {
    [managerName: string]: number;
  };
  total: number;
}

export interface ProcessedChartData {
  data: ChartDataPoint[];
  managers: string[];
}

// Типы для новых графиков
export interface ChannelData {
  channel: string;
  value: number;
  color: string;
}

export interface ConversionData {
  period: string;
  received: number;
  qualified: number;
  conversionRate: number;
}

export interface SuccessByChannelData {
  channel: string;
  total: number;
  successful: number;
  successRate: number;
  color: string;
}

export interface SuccessByTypeData {
  type: string;
  value: number;
  color: string;
}

export interface FailedDealsData {
  reason: string;
  value: number;
  color: string;
}

export interface ChannelConversionData {
  channel: string;
  total: number;
  successful: number;
  conversionRate: number;
  color: string;
}

export interface ManagerData {
  label: string;
  datasets: {
    label: string;
    data: number;
    backgroundColor: string;
  }[];
}

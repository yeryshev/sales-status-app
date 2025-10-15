export interface MonthlyReportData {
  id: number;
  year: number;
  month: number;
  idInside: number;
  leadsCall: number;
  leadsEmail: number;
  leadsEvent: number;
  leadsTotal: number;
  leadsSuccess: number;
  leadsTickets: number;
  leadsCampaign: number;
  leadsChatwoot: number;
  leadsTelegram: number;
  leadsColdCall: number;
  leadsQualified: number;
  leads142Upsale: number;
  leads142Newsale: number;
  leads143Noanswer: number;
  leads143Bedservice: number;
  leadsSuccessByCall: number;
  leads143Legalproblem: number;
  leads143Nomoreneeded: number;
  leads143Noopportunity: number;
  leadsPersonalContact: number;
  leadsSuccessByEmail: number;
  leadsSuccessByEvent: number;
  leadsSuccessByTickets: number;
  leads142Accounttransfer: number;
  leadsSuccessByCampaign: number;
  leadsSuccessByChatwoot: number;
  leadsSuccessByTelegram: number;
  leadsSuccessByColdCall: number;
  leadsSuccessByPersonalContact: number;
}

export interface MonthlyReportUser {
  idInside: number;
  managerName: string;
  reports: MonthlyReportData[];
}

export interface MonthlyReportOverall {
  type: 'overAll';
  reports: MonthlyReportData[];
}

export interface MonthlyReportResponse {
  result: {
    users: MonthlyReportUser[];
    overAll: MonthlyReportOverall;
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

export interface ManagerData {
  label: string;
  datasets: {
    label: string;
    data: number;
    backgroundColor: string;
  }[];
}

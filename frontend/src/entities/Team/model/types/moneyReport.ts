export interface MoneyReportData {
  idInside: number;
  managerName: string;
  year: number;
  month: number;
  faktK: number;
  plan: number;
  nett: number;
}

export type MoneyReportResponse = MoneyReportData[];

export interface ProcessedMoneyData {
  managers: string[];
  months: string[];
  data: {
    [managerName: string]: {
      [monthKey: string]: {
        faktK: number;
        plan: number;
        nett: number;
      };
    };
  };
}

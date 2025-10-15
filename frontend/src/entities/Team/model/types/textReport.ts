export interface TextReport {
  id: number;
  id_inside: number;
  year: number;
  month: number;
  department: 'inbound' | 'account';
  description: string;
  type: 'done' | 'notDone' | 'plans';
}

export type TextReportResponse = TextReport[];
